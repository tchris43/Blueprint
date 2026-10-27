// Starts the Blueprint server. Kept apart from index.ts so tests can import the app without listening.

import { DEMO_SHOP_DIR, PORT } from "./config";
import { server } from "./index";

server.listen(PORT, () => {
  console.log(`Blueprint server on http://localhost:${PORT}  (ws://localhost:${PORT}/live)`);
  console.log(`Checking against demo-shop at ${DEMO_SHOP_DIR}`);
});
