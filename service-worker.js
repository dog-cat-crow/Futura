const CACHE_NAME = 'my-cache'; // Define your cache name

self.addEventListener('install', event => {
    console.log('Service Worker installing...');
    // Skip waiting to activate the new service worker immediately
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker activating...');
});

self.addEventListener('fetch', event => {
    event.respondWith(
        fetch(event.request).then(response => {
            // Check if the response is valid and if it's an MP3 file
            if (response && response.status === 200 && response.headers.get('Content-Type').includes('audio/mpeg')) {
                // Cache the response
                caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, response.clone());
                });
            }
            return response; // Return the response (network or cache)
        }).catch(error => {
            console.error('Fetching failed:', error);
            return caches.match(event.request); // Return cache if network fails
        })
    );
});
