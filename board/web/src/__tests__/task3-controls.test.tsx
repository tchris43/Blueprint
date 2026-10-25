// Task 3 — tasks/board/3-scene-switcher-and-toggles.md
// Tests define done for this piece. Don't edit this file without telling the team; if a test looks wrong, raise it.   Run: pnpm test:board

import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { SceneSwitcher, Toggle } from "../Controls";
import { scenes } from "../sampleData";

afterEach(cleanup);

const titles = scenes.map((s) => s.title);

describe("SceneSwitcher", () => {
  it("shows one button per scene, numbered 1 to 9", () => {
    render(<SceneSwitcher titles={titles} current={0} onChange={() => {}} />);
    expect(screen.getAllByRole("button").map((b) => b.textContent)).toEqual(["1", "2", "3", "4", "5", "6", "7", "8", "9"]);
  });

  it("marks the current scene as pressed", () => {
    render(<SceneSwitcher titles={titles} current={3} onChange={() => {}} />);
    const pressed = screen.getAllByRole("button").filter((b) => b.getAttribute("aria-pressed") === "true");
    expect(pressed.map((b) => b.textContent)).toEqual(["4"]);
  });

  it("reports the 0-based index when a scene is clicked", () => {
    const onChange = vi.fn();
    render(<SceneSwitcher titles={titles} current={0} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: /^scene 4/i }));
    expect(onChange).toHaveBeenCalledWith(3);
  });
});

describe("Toggle", () => {
  const options: ["code" | "product", string][] = [["code", "Code"], ["product", "Product"]];

  it("marks only the active option as pressed", () => {
    render(<Toggle label="View" value="product" options={options} onChange={() => {}} />);
    expect(screen.getByRole("button", { name: "Product" }).getAttribute("aria-pressed")).toBe("true");
    expect(screen.getByRole("button", { name: "Code" }).getAttribute("aria-pressed")).toBe("false");
  });

  it("reports the option's value when clicked", () => {
    const onChange = vi.fn();
    render(<Toggle label="View" value="code" options={options} onChange={onChange} />);
    fireEvent.click(screen.getByRole("button", { name: "Product" }));
    expect(onChange).toHaveBeenCalledWith("product");
  });

  // Edge case: screen readers need to know what the group is for.
  it("labels the group so screen readers can announce it", () => {
    render(<Toggle label="Layer" value="code" options={options} onChange={() => {}} />);
    expect(screen.getByRole("group", { name: "Layer" })).toBeTruthy();
  });
});
