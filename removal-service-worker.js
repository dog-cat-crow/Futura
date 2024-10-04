const CACHE_NAME = 'futura-music-v1'; // Name of the cache
const urlsToCache = [
    '/', // Cache the root HTML file
    'index.html', // Cache the main HTML file
    'songs.json', // Cache the songs JSON file
    'play.png', // Cache play icon
    'pause.png', // Cache pause icon
    'reset.png', // Cache reset icon
    'mute.png', // Cache mute icon
    'unmute.png', // Cache unmute icon
    'Poppins-Regular.ttf', // Cache Poppins font
    'Futura Bold font.ttf', // Cache Futura Bold font
    'Copperplate-Gothic.ttf', // Cache Copperplate Gothic font
];

// Install event to cache initial resources
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Caching initial resources');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event to serve cached resources
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // If the resource is in the cache, return it, else fetch from the network
                return response || fetch(event.request).then((fetchResponse) => {
                    // Cache the fetched resource if it's an audio or image file
                    if (event.request.url.endsWith('.mp3') || event.request.url.endsWith('.jpg')) {
                        return caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, fetchResponse.clone());
                            return fetchResponse;
                        });
                    }
                    return fetchResponse;
                });
            })
    );
});

// Activate event to clean up old caches and cache song files
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Fetch song data and cache song files
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'CACHE_SONGS') {
        fetch('songs.json')
            .then(response => response.json())
            .then(data => {
                const songTitles = data.songs;
                const songUrls = songTitles.map(title => `${title}.mp3`);
                const imageUrls = songTitles.map(title => `${title}.jpg`);

                // Combine audio and image URLs for caching
                const urlsToCache = [...songUrls, ...imageUrls];

                return caches.open(CACHE_NAME).then(cache => {
                    return cache.addAll(urlsToCache); // Cache all song and image files
                });
            })
            .catch(error => {
                console.error('Failed to cache songs:', error);
            });
    }
});
