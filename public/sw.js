// Service Worker pour gérer la persistance et la synchronisation
const CACHE_NAME = 'kanae-quizz-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/easy.html',
  '/leaderboard.html',
  '/easy.js'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
