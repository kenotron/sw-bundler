var CACHE_NAME = "dummy-cache-v1";
var urlsToCache = [
  "/",
  "/main.js",
  "/installServiceWorker.js",
  "/bootstrap.js",
  "/square.js",
];

self.addEventListener("install", function (event) {
  // Perform install steps
  console.log("opening cache");
  event.waitUntil(caches.open(CACHE_NAME));
});

self.addEventListener("fetch", function (event) {
  console.log("fetching ", event.request.url);
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response

      if (response) {
        console.log("cached ", event.request.url);
        return response;
      }

      return caches.open(CACHE_NAME).then((cache) => {
        if (event.request.url === "http://localhost:3000/bootstrap.js") {
          const bundleMainRequest = new Request(
            "http://localhost:3000/b/bootstrap.js"
          );

          return fetch(bundleMainRequest)
            .then((response) => {
              return response.text();
            })
            .then(async (bundleSrc) => {
              const delimiterPattern = /###[^#]+###/g;
              const matches = bundleSrc.match(delimiterPattern);
              let bootstrapRes = null;

              if (matches) {
                const fileContents = bundleSrc.split(delimiterPattern).slice(1);

                for (const [index, match] of matches.entries()) {
                  const [_a, name, _b] = match.split("###");

                  const fileRequest = new Request(
                    `http://localhost:3000/${name}`
                  );

                  const response = new Response(fileContents[index], {
                    headers: { "content-type": "application/javascript" },
                  });

                  console.log(
                    "putting cache",
                    fileRequest.url,
                    fileContents[index]
                  );

                  await cache.put(fileRequest, response);

                  if (name === "bootstrap.js") {
                    bootstrapRes = response;
                  }
                }
              }

              return bootstrapRes;
            });
        } else {
          console.log(event.request.url);
          return fetch(event.request);
        }
      });
    })
  );
});
