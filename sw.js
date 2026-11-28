const V = "gff-v3";
const ARQ = ["./", "index.html", "styles.css", "supabase.js", "auth.js", "app.js", "manifest.json", "assets/icon.svg"];
self.addEventListener("install", e => { e.waitUntil(caches.open(V).then(c => c.addAll(ARQ))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(n => n !== V).map(n => caches.delete(n)))));
  self.clients.claim();
});
// Rede primeiro (evita cache antigo escondendo botões); cache só como reserva offline.
self.addEventListener("fetch", e => {
  const r = e.request;
  if (r.method !== "GET" || new URL(r.url).origin !== location.origin) return;
  e.respondWith(fetch(r).then(res => { const c = res.clone(); caches.open(V).then(x => x.put(r, c)); return res; }).catch(() => caches.match(r)));
});
