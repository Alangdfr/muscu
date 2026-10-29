// Service worker Muscu 3 : l'app s'ouvre sans réseau.
// Réponse immédiate depuis le cache, mise à jour en arrière-plan (appliquée au lancement suivant).
// L'ancienne version (à la racine) garde son propre service worker.
const CACHE = 'muscu-v3-3';
const ASSETS = [
  './', './index.html', './manifest.webmanifest', './css/app.css',
  './js/app.js', './js/store.js', './js/program.js',
  './icons/icon.svg', './icons/icon-180.png', './icons/icon-192.png', './icons/icon-512.png', './icons/icon-maskable-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k.startsWith('muscu-v3') && k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim()),
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);
  if (req.method !== 'GET' || url.origin !== self.location.origin) return;
  const key = req.mode === 'navigate' ? './index.html' : req;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(key, { ignoreSearch: true });
      const network = fetch(req)
        .then((res) => { if (res && res.ok) cache.put(key, res.clone()); return res; })
        .catch(() => cached);
      return cached || network;
    }),
  );
});
