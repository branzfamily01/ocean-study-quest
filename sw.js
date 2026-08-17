const CACHE='ocean-study-quest-v7';
const ASSETS=[
  "./",
  "./index.html",
  "./css/parts/part1.css",
  "./css/parts/part2.css",
  "./css/parts/part3.css",
  "./css/parts/part4.css",
  "./js/creatures/anglerfish.js",
  "./js/creatures/bundle1.js",
  "./js/creatures/bundle2.js",
  "./js/creatures/bundle3.js",
  "./js/data.js",
  "./js/storage.js",
  "./js/audio.js",
  "./js/app-gzip.js",
  "./js/app-loader.js",
  "./js/xp-recovery.js",
  "./manifest.webmanifest",
  "./assets/ui/icon.svg"
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;}).catch(()=>caches.match('./index.html'))));});
