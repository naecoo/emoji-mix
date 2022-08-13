const cacheKey = 'emoji-mix-cache';

const cacheList = [];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(cacheKey)
      .then(cache => cache.addAll(cacheList))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    Promise.all(
      caches.keys().then(cacheNames => {
        return cacheNames.map(name => {
          if (name !== cacheKey) {
            return caches.delete(name);
          }
        })
      })
    ).then(() => {
      return self.clients.claim();
    })
  );
})

self.addEventListener('fetch', function (e) {
  e.respondWith(
    caches.match(e.request).then(function (r) {
      if (r) return r;

      return fetch(e.request).then(function (response) {
        return caches.open(cacheKey).then(function (cache) {
          cache.put(e.request, response.clone());
          return response;
        });
      });
    })
  );
});
