// Task 2 — tasks/board/2-color-and-tag-nodes.md
// Tests define done for this piece. Don't edit this file without telling the team; if a test looks wrong, raise it.   Run: pnpm test:board

import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import { NodeCard } from "../NodeCard";
import { sceneState } from "../sampleData";

afterEach(cleanup);

function nodeFrom(screenScene: number, id: string) {
  const state = sceneState(screenScene);
  const node = state.nodes.find((n) => n.id === id)!;
  const owner = state.participants.find((p) => p.id === node.owner);
  return { node, owner };
}

describe("NodeCard", () => {
  it("shows the function name and file in Code view", () => {
    const { node } = nodeFrom(1, "account/user.ts#getUser");
    render(<NodeCard node={node} view="code" layer="plans" selected={false} />);
    expect(screen.getByText("getUser()")).toBeTruthy();
    expect(screen.getByText("account/user.ts")).toBeTruthy();
  });

  it("shows the plain-English name and description in Product view", () => {
    const { node } = nodeFrom(1, "account/user.ts#getUser");
    render(<NodeCard node={node} view="product" layer="plans" selected={false} />);
    expect(screen.getByText(node.plainName)).toBeTruthy();
    expect(screen.getByText(node.plainDesc)).toBeTruthy();
  });

  it("exposes the status as data-status (getUser has conflict status in scene 4)", () => {
    const { node } = nodeFrom(4, "account/user.ts#getUser");
    const { container } = render(<NodeCard node={node} view="code" layer="plans" selected={false} />);
    expect(container.querySelector("[data-status]")?.getAttribute("data-status")).toBe("conflict");
  });

  it("tags a conflict box with the word Conflict", () => {
    const { node } = nodeFrom(4, "account/user.ts#getUser");
    render(<NodeCard node={node} view="code" layer="plans" selected={false} />);
    expect(screen.getByText(/conflict/i)).toBeTruthy();
  });

  it("tags in-progress work with Building and the owner's name", () => {
    const { node, owner } = nodeFrom(3, "auth/guest.ts#createGuestSession");
    render(<NodeCard node={node} owner={owner} view="code" layer="plans" selected={false} />);
    expect(screen.getByText(/building.*bob/i)).toBeTruthy();
  });

  it("tags finished work as Built (scene 7)", () => {
    const { node, owner } = nodeFrom(7, "payments/vault.ts#saveCard");
    render(<NodeCard node={node} owner={owner} view="code" layer="plans" selected={false} />);
    expect(screen.getByText(/built/i)).toBeTruthy();
  });

  it("tags drift as not in the plan (cardCache.ts in scene 8)", () => {
    const { node, owner } = nodeFrom(8, "payments/cardCache.ts");
    render(<NodeCard node={node} owner={owner} view="code" layer="plans" selected={false} />);
    expect(screen.getByText(/not in plan/i)).toBeTruthy();
  });

  // Edge case: the coverage layer replaces the status tag with a percentage.
  it("shows '% tested' instead of the status on the Test coverage layer", () => {
    const { node } = nodeFrom(9, "account/user.ts#getUser");
    render(<NodeCard node={node} view="code" layer="coverage" selected={false} />);
    expect(screen.getByText(`${node.coverage}% tested`)).toBeTruthy();
  });
});
