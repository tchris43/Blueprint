// The core of Blueprint: merge two participants' in-progress files over the base repo
// in throwaway temp folders, type-check each combination, and attribute errors.
//
// Rule: an error that appears ONLY when both overlays are applied (A alone passes,
// B alone passes) is a conflict between A and B.

import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import { cp, mkdtemp, mkdir, readFile, rm, symlink, unlink, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { promisify } from "node:util";

const execFileAsync = promisify(execFile);

/** One participant's latest content for each file they changed (path relative to the repo root). */
export type Overlay = { participant: string; files: Record<string, string> };

export type TscError = { file: string; line: number; col: number; code: string; message: string; raw: string };

export type FoundConflict = {
  changedBy: string; // whose change caused it
  affected: string; // whose code now fails
  changedSymbol?: string; // e.g. "getUser"
  error: TscError;
  affectedCode: string; // the failing source line, trimmed
};

export type SameFileConflict = { file: string; between: [string, string] };

export type CheckResult = {
  conflicts: FoundConflict[];
  sameFile: SameFileConflict[];
  errors: { a: TscError[]; b: TscError[]; combined: TscError[] };
};

export async function runCombinedCheck(baseDir: string, a: Overlay, b: Overlay): Promise<CheckResult> {
  const sharedFiles = Object.keys(a.files).filter((path) => path in b.files);
  if (sharedFiles.length > 0) {
    // Both edited the same file: flag it at file level, no type check needed.
    return {
      conflicts: [],
      sameFile: sharedFiles.map((file) => ({ file, between: [a.participant, b.participant] })),
      errors: { a: [], b: [], combined: [] },
    };
  }

  const [onlyA, onlyB, combined] = await Promise.all([
    typeCheckWith(baseDir, [a]),
    typeCheckWith(baseDir, [b]),
    typeCheckWith(baseDir, [a, b]),
  ]);

  const seenAlone = new Set([...onlyA.errors, ...onlyB.errors].map(errorKey));
  const newInCombined = combined.errors.filter((error) => !seenAlone.has(errorKey(error)));

  const conflicts = newInCombined.map((error): FoundConflict => {
    // Whoever owns the failing file is "affected"; the other participant caused it.
    const affected = error.file in b.files ? b : a;
    const changedBy = affected === a ? b : a;
    const affectedCode = combined.lines(error.file)[error.line - 1]?.trim() ?? "";
    return {
      changedBy: changedBy.participant,
      affected: affected.participant,
      changedSymbol: pickChangedSymbol(changedBy, affectedCode, baseDir),
      error,
      affectedCode,
    };
  });

  return { conflicts, sameFile: [], errors: { a: onlyA.errors, b: onlyB.errors, combined: combined.errors } };
}

// ---- helpers ----

type CheckedCopy = { errors: TscError[]; lines: (file: string) => string[] };

async function typeCheckWith(baseDir: string, overlays: Overlay[]): Promise<CheckedCopy> {
  const dir = await mkdtemp(join(tmpdir(), "blueprint-check-"));
  const merged: Record<string, string> = Object.assign({}, ...overlays.map((o) => o.files));
  try {
    // AUDIT: copies the base repo's WORKING TREE, not the demo-start tag. If someone edits
    // demo-shop directly (instead of through an agent overlay), the base drifts silently.
    // Run scripts/reset-demo.sh before rehearsals.
    await cp(baseDir, dir, {
      recursive: true,
      filter: (src) => !/[\\/](node_modules|\.git)([\\/]|$)/.test(src.slice(baseDir.length)),
    });
    // Link node_modules instead of copying it so a check stays ~1-3s.
    await symlink(join(baseDir, "node_modules"), join(dir, "node_modules"), "junction");
    for (const [path, content] of Object.entries(merged)) {
      await mkdir(dirname(join(dir, path)), { recursive: true });
      await writeFile(join(dir, path), content);
    }

    const output = await runTsc(baseDir, dir);
    const fileContents = new Map<string, string[]>();
    for (const error of output) {
      if (!fileContents.has(error.file)) {
        fileContents.set(error.file, (await readFile(join(dir, error.file), "utf8")).split(/\r?\n/));
      }
    }
    return { errors: output, lines: (file) => fileContents.get(file) ?? [] };
  } finally {
    // AUDIT: remove the node_modules link FIRST. A recursive rm that followed the junction
    // would delete demo-shop's real node_modules.
    await unlink(join(dir, "node_modules")).catch(() => {});
    await rm(dir, { recursive: true, force: true });
  }
}

async function runTsc(baseDir: string, projectDir: string): Promise<TscError[]> {
  const tscPath = join(baseDir, "node_modules", "typescript", "bin", "tsc");
  try {
    await execFileAsync(process.execPath, [tscPath, "--noEmit", "--pretty", "false", "-p", projectDir], { cwd: projectDir });
    return [];
  } catch (failure) {
    const stdout = (failure as { stdout?: string }).stdout ?? "";
    const errors = parseTscOutput(stdout);
    if (errors.length === 0) throw failure; // tsc itself broke (missing install, bad config)
    return errors;
  }
}

export function parseTscOutput(stdout: string): TscError[] {
  const pattern = /^(.+?)\((\d+),(\d+)\): error (TS\d+): (.*)$/;
  return stdout.split(/\r?\n/).flatMap((raw) => {
    const match = pattern.exec(raw);
    if (!match) return [];
    const [, file, line, col, code, message] = match;
    return [{ file: file.replace(/\\/g, "/"), line: Number(line), col: Number(col), code, message, raw }];
  });
}

function errorKey(error: TscError): string {
  return `${error.file}:${error.line}:${error.code}:${error.message}`;
}

/**
 * Which exported function did the other participant change? Compares export signatures
 * line by line against the base. Prefers a symbol that appears on the failing line.
 */
function pickChangedSymbol(changedBy: Overlay, affectedCode: string, baseDir: string): string | undefined {
  const changed = Object.entries(changedBy.files).flatMap(([path, content]) =>
    changedExportSignatures(readBaseFile(baseDir, path), content),
  );
  return changed.find((name) => affectedCode.includes(`${name}(`)) ?? changed[0];
}

function changedExportSignatures(baseContent: string, newContent: string): string[] {
  const signatures = (source: string) => {
    const found = new Map<string, string>();
    for (const match of source.matchAll(/^export function (\w+)([^{]*)/gm)) found.set(match[1], match[2].trim());
    return found;
  };
  const before = signatures(baseContent);
  return [...signatures(newContent)].filter(([name, sig]) => before.get(name) !== sig).map(([name]) => name);
}

function readBaseFile(baseDir: string, path: string): string {
  try {
    return readFileSync(join(baseDir, path), "utf8");
  } catch {
    return ""; // new file: every export counts as changed
  }
}
