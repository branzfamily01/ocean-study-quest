const CACHE='ocean-study-quest-v9';
const ASSETS=[
  "./",
  "./index.html",
  "./css/parts/part1.css?v=8",
  "./css/parts/part2.css?v=8",
  "./css/parts/part3.css?v=8",
  "./css/parts/part4.css?v=8",
  "./js/creatures/anglerfish.js?v=8",
  "./js/creatures/bundle1.js?v=8",
  "./js/creatures/bundle2.js?v=8",
  "./js/creatures/bundle3.js?v=8",
  "./js/data.js?v=8",
  "./js/storage.js?v=8",
  "./js/audio.js?v=8",
  "./js/app-gzip.js?v=8",
  "./js/app-loader.js?v=8",
  "./js/xp-recovery.js?v=8",
  "./manifest.webmanifest?v=8",
  "./assets/ui/icon.svg?v=8"
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{
  if(e.request.method!=='GET')return;
  const nav=e.request.mode==='navigate';
  if(nav){
    e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put('./index.html',copy));return resp;}).catch(()=>caches.match('./index.html')));
    return;
  }
  e.respondWith(fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;}).catch(()=>caches.match(e.request)));
});
