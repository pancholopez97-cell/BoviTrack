const CACHE='bovitrack-offline-v5';
const APP_SHELL=[
  './',
  './index.html?v=5',
  './manifest.webmanifest?v=5',
  './icon-192.png?v=5',
  './icon-512.png?v=5',
  './apple-touch-icon.png?v=5',
  './bovitrack-logo.png?v=5'
];
self.addEventListener('install',event=>{
  event.waitUntil(caches.open(CACHE).then(cache=>cache.addAll(APP_SHELL)).then(()=>self.skipWaiting()));
});
self.addEventListener('activate',event=>{
  event.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim()));
});
self.addEventListener('fetch',event=>{
  if(event.request.method!=='GET')return;
  if(event.request.mode==='navigate'){
    event.respondWith(fetch(event.request).then(response=>{
      const copy=response.clone();
      caches.open(CACHE).then(cache=>cache.put('./index.html?v=5',copy));
      return response;
    }).catch(()=>caches.match('./index.html?v=5')));
    return;
  }
  event.respondWith(fetch(event.request).then(response=>{
    if(response&&response.status===200){const copy=response.clone();caches.open(CACHE).then(cache=>cache.put(event.request,copy))}
    return response;
  }).catch(()=>caches.match(event.request)));
});