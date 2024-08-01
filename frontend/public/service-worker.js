const CACHE_NAME = 'my-cache-v2';
const URLs_TO_CACHE = [
  '/',
  '/index.html',
  '/static/js/main.7f9c402d.js',
  '/static/css/main.c8f4b9cb.css',
  '/menu',
  '/manifest.json',
  '/logo192.png',
  '/assets/logo.png',
  '/assets/logo192.png',
  '/assets/fonts/myfont.woff2',
  '/static/media/food1.638115e094b996a760d6.jpeg',
  '/static/media/food2.c16564fae229e8fe05f9.jpeg',
  '/static/media/food3.d3b00222a7f574c2e2b2.jpeg',
  '/static/media/logo4.0cc18720f62cbfc462ed.png',
  '/static/media/bg.1641e559193791cf5c09.jpg',
];



self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(URLs_TO_CACHE);
    })
  );
});


self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-recipes') {
    event.waitUntil(syncRecipes());
  }
});

const syncRecipes = async () => {
  const db = await idb.openDB('recipe-store', 1);
  const recipes = await db.getAll('recipes');
  
  for (const recipe of recipes) {
    try {
      const response = await fetch('http://localhost:5000/recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
      });

      if (response.ok) {
        await db.delete('recipes', recipe.id);
      }
    } catch (error) {
      console.error('Failed to sync recipe:', recipe, error);
    }
  }
};

self.addEventListener('online', () => {
  self.registration.sync.register('sync-recipes');
});

self.addEventListener('activate', (event) => {
  // Perform cleanup of old caches if needed
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  console.log('[Service Worker] Fetch', event.request.url);
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) {
        console.log('[Service Worker] Fetching resource from cache:', event.request.url);
        return response;
      }
      console.log('[Service Worker] Fetching resource from network:', event.request.url);
      return fetch(event.request).catch(() => {
        console.error('[Service Worker] Fetch failed; returning offline page instead.');
        return caches.match('/');
      });
    })
  );
});

