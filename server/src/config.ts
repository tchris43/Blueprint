import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));

export const PORT = Number(process.env.PORT ?? 4000);

// AUDIT: defaults to a demo-shop clone sitting next to this repo. If the team clones it
// somewhere else, set DEMO_SHOP_DIR or every combined check fails with "tsc not found".
export const DEMO_SHOP_DIR = resolve(process.env.DEMO_SHOP_DIR ?? resolve(here, "../../../demo-shop"));

export const SAMPLE_STATE_PATH = resolve(here, "../../shared/sample-state.json");
