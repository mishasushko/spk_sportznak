const CACHE_NAME = 'spk-sportznak-v6';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/styles.css?v=1.2',
  '/js/main.js?v=1.1',
  '/site.webmanifest',
  '/favicon.ico',
  '/flag-russia.png'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch(() => {
        // Some resources may fail (analytics endpoints) — ignore
      });
    })
  );
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(
      keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
    ))
  );
  self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  // Only handle same-origin requests
  if (url.origin !== location.origin) return;

  // Для HTML-страниц (запросы навигации) используем стратегию Network First
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request).then((response) => {
        const respClone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        return response;
      }).catch(() => {
        // Если интернета нет, показываем понятную автономную страницу
        return caches.match('/offline.html');
      })
    );
    return;
  }

  // Для остальных ресурсов (CSS, JS, картинки) оставляем стратегию Cache First
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        // Optionally cache GET requests for future use
        if (event.request.method === 'GET' && response && response.status === 200 && response.type === 'basic') {
          const respClone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, respClone));
        }
        return response;
      });
    })
  );
});
