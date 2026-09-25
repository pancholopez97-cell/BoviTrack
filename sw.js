const CACHE='bovitrack-v6-1-home-buttons-fix-v1';
const ASSETS=[
  "./bovitrack-fondo-global.jpg",
 './',
 './index.html',
 './manifest.webmanifest',
 './bovitrack-logo.png',
 './apple-touch-icon.png',
 './icon-192.png',
 './icon-512.png',
 './bovitrack-pradera.svg',
 './bovitrack-pradera.png',
 './bovitrack-bg.jpg'
];

self.addEventListener('install',event=>{
 event.waitUntil(
   caches.open(CACHE).then(cache=>cache.addAll(ASSETS)).then(()=>self.skipWaiting())
 );
});

self.addEventListener('activate',event=>{
 event.waitUntil(
   caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))
   .then(()=>self.clients.claim())
 );
});

self.addEventListener('fetch',event=>{
 if(event.request.method!=='GET') return;
 event.respondWith(
   caches.match(event.request).then(cached=>{
     if(cached) return cached;
     return fetch(event.request).then(response=>{
       if(!response || response.status!==200) return response;
       const copy=response.clone();
       caches.open(CACHE).then(cache=>cache.put(event.request,copy));
       return response;
     }).catch(()=>{
       if(event.request.mode==='navigate') return caches.match('./index.html');
       return new Response('',{status:503,statusText:'Offline'});
     });
   })
 );
});
