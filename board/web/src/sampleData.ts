// The sample scenes from shared/sample-state.json, so the board works with no server.

import type { BoardState, SampleStateFile } from "../../../shared/contract";
import sampleFile from "../../../shared/sample-state.json";

// JSON imports are typed loosely (string, not "dev" | "pm"), so trust the contract test here.
export const scenes = (sampleFile as unknown as SampleStateFile).scenes;

/** Scene as numbered ON SCREEN and in docs/mockup (1-9). sceneState(4) is the collision. */
export function sceneState(screenNumber: number): BoardState {
  return scenes[screenNumber - 1].state;
}

export type View = "code" | "product";
export type Layer = "plans" | "coverage";
