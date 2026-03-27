const CACHE_NAME = 'neon-dash-v1';
const ASSETS = [
    'index.html',
    'style.css',
    'game.js',
    'manifest.json',
    'icon-192.png',
    'icon-512.png'
];

// 1. Install Event: Save all files to the phone's cache
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS);
        })
    );
});

// 2. Activate Event: Clean up old versions of the game
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))
            );
        })
    );
});

// 3. Fetch Event: Serve files from cache if offline
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});