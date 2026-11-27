const V = 'stapar-chu3-8e827be0';
const SHELL = ['./', 'index.html', 'habatan.json', 'manifest.webmanifest', 'icons/icon-192.png'];
self.addEventListener('install', e => { e.waitUntil(caches.open(V).then(c => c.addAll(SHELL)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => (k.startsWith('stapar-chu3-') || k.startsWith('stapar-aud-')) && k !== V && k !== 'stapar-aud-23b2cfda').map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  const u = new URL(e.request.url); if (e.request.method !== 'GET' || u.origin !== location.origin) return;
  // the other grades' apps live in sub-folders (chu1/, chu2/) with their own service workers: leave them alone
  const rel = u.pathname.slice(new URL(self.registration.scope).pathname.length); if (/^[^/]+\//.test(rel) && !/^(aud|icons)\//.test(rel)) return;
  const audio = u.pathname.includes('/aud/'); const store = audio ? 'stapar-aud-23b2cfda' : V;
  if (audio) { e.respondWith(caches.open(store).then(c => c.match(e.request).then(r => r || fetch(e.request).then(n => { if (n.ok) c.put(e.request, n.clone()); return n; })))); return; }
  // app files: network first so updates arrive, cache when offline
  e.respondWith(fetch(e.request).then(n => { if (n.ok) { const cp = n.clone(); caches.open(store).then(c => c.put(e.request, cp)); } return n; }).catch(() => caches.match(e.request, {ignoreSearch: true}).then(r => r || caches.match('index.html'))));
});
