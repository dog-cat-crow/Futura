const CACHE_NAME = 'dynamic-music-cache-v1';

self.addEventListener('install', event => {
    // No need to cache anything during install if we only want dynamic caching
    self.skipWaiting();
});

self.addEventListener('fetch', event => {
    const request = event.request;

    // Check if the request is for an MP3 or image file
    if (request.url.endsWith('.mp3') || request.url.endsWith('.jpg')) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                // If there's a cached response, return it
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Fetch from network and cache it
                return fetch(request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        // Only cache the response if it's valid
                        if (networkResponse && networkResponse.status === 200) {
                            cache.put(request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
    } else {
        // Default fetch response for other requests
        event.respondWith(fetch(request).catch(() => caches.match(request)));
    }
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
