const CACHE_NAME = 'spk-sportznak-v10';
const ASSETS_TO_CACHE = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/styles.css?v=1.5',
  '/js/consent.js?v=1.0',
  '/js/main.js?v=1.4',
  '/site.webmanifest',
  '/favicon.ico',
  '/flag-russia.png',
  '/fonts/CaviarDreams_Bold.woff2',
  '/fonts/Novartis.woff2'
];


self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache each file separately so one missing file does not break the whole precache
      return Promise.all(ASSETS_TO_CACHE.map((url) =>
        cache.add(url).catch((err) => console.warn('Precache failed:', url, err))
      ));
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
