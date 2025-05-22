const CACHE_NAME = 'rustmark-support-v1'; // Update this version number when you change cached files
const urlsToCache = [
  './', // Caches index.html
  'index.html',
  'clients.json',
  'browser.png',
  'logo.png',
  'https://code.jquery.com/jquery-3.5.1.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap',
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3bDVaAHpLbgxA.woff2', /* Example font file, you might need others */
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3bDVaAHpLbgxA.woff',
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3bDVaAHpLbgxA.ttf'
];

// Install event: Caches the necessary files
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Activates the service worker immediately
});

// Fetch event: Serves cached content if available, otherwise fetches from network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // No cache hit - fetch from network
        return fetch(event.request).then(
          (response) => {
            // Check if we received a valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and can only be consumed once. We must clone it so that
            // we can consume one in the cache and one in the browser.
            const responseToCache = response.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return response;
          }
        );
      })
  );
});

// Activate event: Cleans up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim(); // Ensures the service worker takes control immediately
});
