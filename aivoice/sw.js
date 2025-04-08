const CACHE_NAME = 'sl-tracker-v1';

// Basic files to cache
const urlsToCache = [
    './',
    './index.html',
    './styles.css',
    './components/XPSystem.js',
    './components/DailyQuests.js',
    './components/VoiceRecorder.js',
    './components/DashboardForm.js'
];

// Install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
            .catch((err) => {
                console.log('Cache error:', err);
            })
    );
});

// Fetch resources
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
            .catch((err) => {
                console.log('Fetch error:', err);
            })
    );
});