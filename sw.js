// Service worker Muscu : l'app s'ouvre instantanément, même sans réseau.
// Stratégie : réponse immédiate depuis le cache, mise à jour en arrière-plan
// (la nouvelle version s'applique au lancement suivant).
const CACHE = 'muscu-v2-1';
const ASSETS = ['./', './index.html', './manifest.webmanifest', './icon-180.png', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE && !k.startsWith('muscu-v3')).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET' || new URL(request.url).origin !== self.location.origin) return;
  // La nouvelle app (dossier masse/) a son propre service worker : on la laisse passer.
  if (new URL(request.url).pathname.includes('/masse/')) return;
  const key = request.mode === 'navigate' ? './index.html' : request;
  event.respondWith(
    caches.open(CACHE).then(async (cache) => {
      const cached = await cache.match(key, { ignoreSearch: true });
      const network = fetch(request)
        .then((response) => {
          if (response && response.ok) cache.put(key, response.clone());
          return response;
        })
        .catch(() => cached);
      return cached || network;
    })
  );
});
