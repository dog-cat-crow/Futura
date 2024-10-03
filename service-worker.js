const CACHE_NAME = 'dynamic-music-cache-v1';

self.addEventListener('install', event => {
    // The install event can be used to cache static assets if needed
    event.waitUntil(self.skipWaiting());
});

// Fetch event to cache MP3 and image files dynamically
self.addEventListener('fetch', event => {
    const request = event.request;

    // Check if the request is for an MP3 or image file
    if (request.url.endsWith('.mp3') || request.url.endsWith('.jpg')) {
        event.respondWith(
            caches.match(request).then(cachedResponse => {
                // If the file is in cache, return it
                if (cachedResponse) {
                    return cachedResponse;
                }

                // Otherwise, fetch it and add it to the cache
                return fetch(request).then(networkResponse => {
                    return caches.open(CACHE_NAME).then(cache => {
                        cache.put(request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
    } else {
        // For other requests (HTML, CSS, etc.), fallback to normal network fetching
        event.respondWith(fetch(request).catch(() => caches.match(request)));
    }
});

// Clean up old caches when a new version is activated
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
