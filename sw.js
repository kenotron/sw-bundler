var CACHE_NAME = "dummy-cache";
var urlsToCache = [
  "/",
  "/main.js",
  "/installServiceWorker.js",
  "/bootstrap.js",
  "/square.js",
];

self.addEventListener("install", function (event) {
  // Perform install steps
  event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      if (event.request.url.endsWith(".js")) {
        return fetch(event.request)
          .then((response) => {
            return response.text();
          })
          .then((src) => {
            if (event.request.url.includes("bootstrap.js")) {
              return new Response(src.replace("square.js", "square2.js"), {
                headers: { "content-type": "application/javascript" },
              });
            } else {
              return new Response(src, {
                headers: { "content-type": "application/javascript" },
              });
            }
          });
      } else {
        return fetch(event.request);
      }
    })
  );
});
