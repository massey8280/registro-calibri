// Registro calibri — service worker. Per aggiornare l'app cambia CACHE.
const CACHE='registro-calibri-v0.11.0';
const SHELL=['./','./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png','./inter.woff2'];
self.addEventListener('install',e=>{ e.waitUntil(caches.open(CACHE).then(c=>c.addAll(SHELL)).then(()=>self.skipWaiting())); });
self.addEventListener('activate',e=>{ e.waitUntil(caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch',e=>{ if(e.request.method!=='GET') return;
  const u=new URL(e.request.url); if(u.origin!==self.location.origin||u.pathname.indexOf('/api/')!==-1) return; // API: sempre rete, mai cache
  e.respondWith(caches.match(e.request,{ignoreSearch:true}).then(r=>r||fetch(e.request).then(res=>{
    if(res.ok&&new URL(e.request.url).origin===self.location.origin){ const cp=res.clone(); caches.open(CACHE).then(c=>c.put(e.request,cp)); }
    return res; }).catch(()=>caches.match('./index.html')))); });
