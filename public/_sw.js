const cacheKey = 'emoji-mix-cache';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  event.waitUntil(clients.claim());
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      if (r) return r;

      return fetch(e.request).then(function (response) {
        const url = e.request.url;
        if (url.endsWith('.svg') || url.endsWith('.png')) {
          return caches.open(cacheKey).then(function (cache) {
            cache.put(e.request, response.clone());
            return response;
          });
        }

        return response;
      });
    })
  );
});
