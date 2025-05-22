// Service Worker Cache Name
// Increment this version number whenever you make changes to any cached assets (HTML, CSS, JS, images, JSON, fonts).
// This ensures users get the latest version of your PWA.
const CACHE_NAME = 'rustmark-support-v2'; // Changed from v1 to v2 as we're refining.

// List of URLs to cache during installation
// These are the core assets of your application that should be available offline.
const urlsToCache = [
  './', // Caches the root path, usually index.html
  'index.html',
  'style.css', // External CSS file
  'script.js', // External JavaScript file
  'clients.json', // Your client data file
  'browser.png', // Favicon and PWA icon
  'logo.png', // Company logo image (ensure this matches your file name)
  'manifest.json', // Web App Manifest

  // External libraries/resources:
  'https://code.jquery.com/jquery-3.5.1.js',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;600&display=swap',

  // Google Fonts actual font files (IMPORTANT: Verify these URLs in your browser's Network tab!)
  // These URLs can change, so check them directly if you encounter font loading issues offline.
  // Example: When your page loads, open DevTools -> Network tab, filter by "font", and copy the exact URLs.
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3bDVaAHpLbgxA.woff2',
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3bDVaAHpLbgxA.woff',
  'https://fonts.gstatic.com/s/inter/v13/UcC73FwrK3bDVaAHpLbgxA.ttf'
];

// -----------------------------------------------------------------------------
// Install Event: Caching static assets
// This event fires when the service worker is first registered.
// It opens a cache and adds all specified static assets to it.
// -----------------------------------------------------------------------------
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('[Service Worker] Opened cache:', CACHE_NAME);
        return cache.addAll(urlsToCache);
      })
      .catch((error) => {
        console.error('[Service Worker] Failed to cache all assets during install:', error);
      })
  );
  // `self.skipWaiting()` forces the waiting service worker to become the active service worker.
  // This allows the service worker to take control of the page immediately, without a page refresh.
  self.skipWaiting();
});

// -----------------------------------------------------------------------------
// Fetch Event: Serving cached content or fetching from network
// This event intercepts all network requests made by the page.
// It first tries to find the requested resource in the cache.
// If found, it serves from cache (cache-first strategy).
// If not found, it fetches from the network and then caches the response for future use.
// -----------------------------------------------------------------------------
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // If resource is in cache, return it
        if (response) {
          return response;
        }

        // Resource not in cache, fetch from network
        return fetch(event.request)
          .then((networkResponse) => {
            // Check if we received a valid response before caching
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse; // Return the response as is if it's not valid for caching
            }

            // IMPORTANT: Clone the response. A response is a stream and can only be consumed once.
            // We must clone it so that we can consume one for caching and one for the browser.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          })
          .catch((error) => {
            // This catch block handles network errors (e.g., user is offline and resource not in cache)
            console.error('[Service Worker] Fetch failed and no cache match for:', event.request.url, error);
            // You could return an offline page here if desired for routes not in cache
            // e.g., return caches.match('/offline.html');
          });
      })
  );
});

// -----------------------------------------------------------------------------
// Activate Event: Cleaning up old caches
// This event fires when the service worker is activated, often after an update.
// It deletes any old caches that are no longer needed, ensuring efficient storage.
// -----------------------------------------------------------------------------
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          // Delete caches that don't match the current CACHE_NAME
          if (cacheName !== CACHE_NAME) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  // `self.clients.claim()` ensures that the activated service worker takes control of any
  // clients (pages) that are currently open within its scope immediately.
  self.clients.claim();
});
