const CACHE_NAME = 'krmitko-cache-v1';
const ASSETS_TO_CACHE = [
    './',
    './index.html',
    './manifest.json',
    './icons/icon-192x192.png',
    './icons/icon-512x512.png',
    'https://www.gstatic.com/firebasejs/9.x.x/firebase-app.js',
    'https://www.gstatic.com/firebasejs/9.x.x/firebase-database.js',
    'https://cdn.jsdelivr.net/npm/chart.js'
];

// Inštalácia Service Workera
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(ASSETS_TO_CACHE);
            })
    );
});

// Aktivácia Service Workera
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Zachytávanie požiadaviek
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
            .catch(() => {
                // Ak zlyhá fetch, vrátime offline stránku
                if (event.request.mode === 'navigate') {
                    return caches.match('./index.html');
                }
            })
    );
});