import { installServiceWorker } from "./installServiceWorker.js";

(async () => {
  await installServiceWorker();
  import("./bootstrap.js");
})();
