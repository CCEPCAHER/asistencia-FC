// sw.js
const CACHE_NAME = 'turnos-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/manifest.json',
  // Añade aquí otros recursos, como imágenes o íconos
];

self.addEventListener('install', (event) => {
  // Precachear todos los recursos necesarios
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caché abierta');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Retorna el recurso de la caché o haz fetch en red
        return response || fetch(event.request);
      })
  );
});
