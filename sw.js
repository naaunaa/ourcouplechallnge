const CACHE_NAME = 'couple-challenge-v2';
const REPO = '/ourcouple';
const urlsToCache = [
  REPO + '/',
  REPO + '/index.html',
  REPO + '/manifest.json',
  REPO + '/icons/icon-192.png',
  REPO + '/icons/icon-512.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).catch(() => caches.match(REPO + '/index.html'));
    })
  );
});
