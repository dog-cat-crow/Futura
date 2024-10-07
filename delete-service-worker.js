const cacheName = 'my-site-cache-v5';
const filesToCache = [
    './',
    'index.html',
    'play.png',
    'pause.png',
    'close.png',
    'songs.json',
    'Alone Part IIx.jpg',
    'Animalsx.jpg',
    'Fly Awayx.jpg',
    'Dynamite.mp3',
    'Dusk Till Dawn.mp3',
    'Calm Down.mp3',
    'Blinding Lights.mp3',
    'Enemy (with JID).mp3',
    'Faded.mp3',
    'Heat Waves.mp3',
    'Ignite.mp3',
    'Symphony.mp3',
    'Stick Together.mp3',
    'Levitating.mp3',
    'Alone Part II.jpg',
    'Animals.jpg',
    'Fly Away.jpg',
    'Dynamite.jpg',
    'Dusk Till Dawn.jpg',
    'Calm Down.jpg',
    'Blinding Lights.jpg',
    'Enemy (with JID).jpg',
    'Faded.jpg',
    'Heat Waves.jpg',
    'Ignite.jpg',
    'Symphony.jpg',
    'Stick Together.jpg',
    'Levitating.jpg',
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName).then(cache => {
            return cache.addAll(filesToCache);
        })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(response => {
                return caches.open(cacheName).then(cache => {
                    // Cache only the requests that are not already in cache
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }
                    cache.put(event.request, response.clone());
                    return response;
                });
            });
        })
    );
});
