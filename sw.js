// مطاعم أبو زيد — Service Worker (تثبيت كتطبيق + فتح أسرع)
const VERSION = 'abuzaid-v3';
const SHELL = ['./', './index.html', './logo.webp', './logo-chef.webp', './icon-192.png', './icon-512.png', './icon-maskable-192.png', './icon-maskable-512.png', './apple-touch-icon.png', './favicon.png', './manifest.json'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== VERSION).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // الطلبات (POST) ما بتتخزن
  const url = new URL(req.url);
  if (url.origin !== location.origin) return;             // الشيت والصور الخارجية: من النت مباشرة
  // ملفات الموقع: من النت أول، وإذا ما في نت من المخزن
  e.respondWith(
    fetch(req).then(res => {
      const copy = res.clone();
      caches.open(VERSION).then(c => c.put(req, copy));
      return res;
    }).catch(() => caches.match(req).then(r => r || caches.match('./index.html')))
  );
});
// ===== نهاية الكود ✅ =====
