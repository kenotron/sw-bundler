export function installServiceWorker() {
  if ("serviceWorker" in navigator) {
    navigator.serviceWorker
      .register("/sw.js")
      .then(function (reg) {
        console.log("sw registered", reg);
      })
      .catch(function (err) {
        console.log("sw error", err);
      });
  }
}
