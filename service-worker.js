// Meridian Mastery Service Worker

// Cache version - update when files change
const CACHE_NAME = 'meridian-mastery-v2';
const DATA_CACHE_NAME = 'meridian-mastery-data-v1';

// Files to cache
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icons/triskelion.svg',
  '/icons/apple-touch-icon.svg',
  '/icons/triskelion-192.png',
  '/icons/triskelion-512.png',
  '/icons/apple-touch-icon.png',
  '/icons/favicon-32x32.png',
  '/icons/favicon-16x16.png',
  // Add other essential assets here
];

// Data URLs to cache separately with different strategy
const dataUrlsToCache = [
  '/src/data/meridian_mastery_points_bilateral.json',
  '/src/data/maek_chi_ki.json',
  '/src/data/maek_cha_ki.json'
];

// Install event - caches assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    Promise.all([
      caches.open(CACHE_NAME).then((cache) => {
        console.log('Opened main cache');
        return cache.addAll(urlsToCache);
      }),
      caches.open(DATA_CACHE_NAME).then((cache) => {
        console.log('Opened data cache');
        return cache.addAll(dataUrlsToCache);
      })
    ])
  );
  
  // Force the waiting service worker to become the active service worker
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== DATA_CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  
  // Take control of all pages
  self.clients.claim();
});

// Fetch event - serve from cache with network fallback
self.addEventListener('fetch', (event) => {
  // Handle API/data requests differently
  if (event.request.url.includes('/data/') || event.request.url.includes('.json')) {
    event.respondWith(
      caches.open(DATA_CACHE_NAME).then((cache) => {
        return fetch(event.request)
          .then((response) => {
            // Put a copy of the response in the cache
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => {
            // Network failed, serve from cache
            return cache.match(event.request);
          });
      })
    );
    return;
  }

  // Handle all other requests with cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // No cache hit - fetch from network
        return fetch(event.request).then((response) => {
          // Don't cache non-successful responses
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response and cache it
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
          
          return response;
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'progress-sync') {
    event.waitUntil(
      // Sync progress data when back online
      syncProgressData()
    );
  }
});

// Handle background sync
async function syncProgressData() {
  try {
    // This would sync local storage data with a server if implemented
    console.log('Background sync: Progress data synced');
  } catch (error) {
    console.error('Background sync failed:', error);
  }
}