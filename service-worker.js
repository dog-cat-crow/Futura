const cacheName = 'my-site-cache-v4';
const filesToCache = [
    './',
    'index.html',
    'play.png',
    'pause.png',
    'close.png',
    'songs.json',
    'Alone Part II.mp3',
    'Animals.mp3',
    'Fly Away.mp3',
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

if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('service-worker.js').then(registration => {
            console.log('Service Worker registered with scope:', registration.scope);
        }).catch(error => {
            console.error('Service Worker registration failed:', error);
        });
    });
}

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
            if (response) {
                return response;
            }
            return fetch(event.request).then(networkResponse => {
                return caches.open(cacheName).then(cache => {
                    cache.put(event.request, networkResponse.clone());
                    return networkResponse;
                });
            }).catch(() => {
                return caches.match('index.html');
            });
        })
    );
});
