// Sun Launcher offline cache. Only touches caches whose name starts with 'sun-launcher-',
// because Docs Reader and Scanner share this web address (harisonbd.github.io).
// v42: two caches. CACHE (app code, new each version, ~0.3 MB) and MEDIA (photos and maps, kept across
// versions so an update does not download them again). Change MEDIA only when a picture's content changes.
const CACHE = 'sun-launcher-v49';
const MEDIA = 'sun-launcher-media-1';
const FILES = ['./', './index.html', './manifest.webmanifest', './icon-192.png', './icon-512.png', './icon-maskable-512.png'];
const PICS = ['./tex-sun.jpg', './tex-sun-4k.jpg', './tex-moon.jpg', './sky-sunset.jpg', './sky-dawn.jpg', './sky-day.jpg', './sky-bluehour.jpg', './sky-night.jpg', './sky-overcast.jpg', './sky-rain.jpg', './sky-snow.jpg', './sky-snow-night.jpg', './sky-fog.jpg', './sky-storm.jpg', './stars-4k.jpg', './saturn.jpg', './saturn-ring.png', './earth-day.jpg', './earth-night.jpg', './earth-clouds.jpg'];
self.addEventListener('install', (e) => {
  e.waitUntil(Promise.all([
    caches.open(CACHE).then((c) => c.addAll(FILES)),
    // a picture already saved (in MEDIA or an older cache) is copied, not downloaded again
    caches.open(MEDIA).then((m) => Promise.all(PICS.map((f) => m.match(f).then((have) => have || caches.match(f)
      .then((old) => old ? m.put(f, old) : m.add(f))))))
  ]).then(() => self.skipWaiting()));
});
self.addEventListener('activate', (e) => {
  e.waitUntil(caches.keys()
    .then((keys) => Promise.all(keys.filter((k) => k.startsWith('sun-launcher-') && k !== CACHE && k !== MEDIA).map((k) => caches.delete(k))))
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
  // extra pictures (photo of the day, 4k sun, 8k Earth) and the city list (v47): saved in MEDIA the first time they are shown
  const extra = /\/((sky-[a-z]+-\d|tex-sun-4k|earth-day-8k|pv-[a-z0-9-]+)\.jpg|cities\.json)$/.test(new URL(req.url).pathname);  // v48: pv- = Settings pictures
  e.respondWith(caches.match(req).then((hit) => hit || fetch(req).then((res) => {
    if (extra && res.ok) { const copy = res.clone(); caches.open(MEDIA).then((c) => c.put(req, copy)); }
    return res;
  })));
});
