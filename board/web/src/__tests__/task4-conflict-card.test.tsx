// Task 4 — tasks/board/4-conflict-card.md
// Tests define done for this piece. Don't edit this file without telling the team; if a test looks wrong, raise it.   Run: pnpm test:board

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { ConflictCard } from "../ConflictCard";
import { sceneState } from "../sampleData";

afterEach(cleanup);

const collision = sceneState(4);
const conflict = collision.conflicts[0];

describe("ConflictCard", () => {
  it("scene 4 shows a conflict card containing 'TS2531'", () => {
    const { container } = render(<ConflictCard conflict={conflict} view="code" participants={collision.participants} onDecide={() => {}} />);
    expect(container.textContent).toContain("TS2531");
  });

  it("shows the plain-English summary and the question in Product view", () => {
    render(<ConflictCard conflict={conflict} view="product" participants={collision.participants} onDecide={() => {}} />);
    expect(screen.getByText(conflict.plainSummary)).toBeTruthy();
    expect(screen.getByText(conflict.question)).toBeTruthy();
  });

  it("has a 'Why was this flagged?' section with the broken line and the compiler error", () => {
    render(<ConflictCard conflict={conflict} view="code" participants={collision.participants} onDecide={() => {}} />);
    expect(screen.getByText("Why was this flagged?")).toBeTruthy();
    expect(screen.getByText(conflict.evidence.affectedCode)).toBeTruthy();
    expect(screen.getByText(conflict.evidence.compilerError)).toBeTruthy();
  });

  it("shows the other person's diff", () => {
    const { container } = render(<ConflictCard conflict={conflict} view="code" participants={collision.participants} onDecide={() => {}} />);
    expect(container.textContent).toContain("getUser(): User | null");
  });

  it("shows one button per option, and reports which one was clicked", () => {
    const onDecide = vi.fn();
    render(<ConflictCard conflict={conflict} view="product" participants={collision.participants} onDecide={onDecide} />);
    fireEvent.click(screen.getByRole("button", { name: conflict.options[1].label }));
    expect(onDecide).toHaveBeenCalledWith(conflict.options[1].id);
  });

  // Edge case: once decided, show the decision instead of the buttons.
  it("after the decision (scene 6), shows what was decided and no option buttons", () => {
    const decided = sceneState(6).conflicts[0];
    render(<ConflictCard conflict={decided} view="product" participants={collision.participants} onDecide={() => {}} />);
    expect(screen.getByText(decided.decision!.text, { exact: false })).toBeTruthy();
    expect(screen.queryByRole("button", { name: decided.options[0].label })).toBeNull();
  });
});
