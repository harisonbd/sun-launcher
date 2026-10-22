// Sun Launcher offline cache. Only touches caches whose name starts with 'sun-launcher-',
// because Docs Reader and Scanner share this web address (harisonbd.github.io).
const CACHE = 'sun-launcher-v38';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png', './tex-sun.jpg', './tex-sun-4k.jpg', './tex-moon.jpg','./sky-sunset.jpg', './sky-dawn.jpg', './sky-day.jpg', './sky-bluehour.jpg', './sky-night.jpg', './sky-overcast.jpg', './sky-rain.jpg', './sky-snow.jpg', './sky-snow-night.jpg', './sky-fog.jpg', './sky-storm.jpg', './stars-4k.jpg', './saturn.jpg', './saturn-ring.png', './earth-day.jpg', './earth-night.jpg', './earth-clouds.jpg'];
self.addEventListener('install', (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sun-launcher-') && k !== CACHE).map((k) => caches.delete(k))))
    .then(() => self.clients.claim()));
});
self.addEventListener('fetch', (e) => {
  const req = e.request;
  if (req.method !== 'GET' || new URL(req.url).origin !== self.location.origin) return;
  if (req.mode === 'navigate') {
    // Newest page when online, saved page when offline.
    e.respondWith(fetch(req).then((res) => { const copy = res.clone(); caches.open(CACHE).then((c) => c.put('./index.html', copy)); return res; })
      .catch(() => caches.match('./index.html')));
    return;
  }
  // extra sky photos (photo of the day): saved the first time they are shown, so they work offline after that
  const extra = /\/(sky-[a-z]+-\d|tex-sun-4k)\.jpg$/.test(new URL(req.url).pathname);
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (extra && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
    return res;
  })));
});
