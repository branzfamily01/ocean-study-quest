const CACHE='ocean-study-quest-v3';
const ASSETS=[
  "./",
  "./index.html",
  "./css/parts/part1.css",
  "./css/parts/part2.css",
  "./css/parts/part3.css",
  "./css/parts/part4.css",
  "./js/creatures/anglerfish.js",
  "./js/creatures/clownfish.js",
  "./js/creatures/crab.js",
  "./js/creatures/dolphin.js",
  "./js/creatures/jellyfish.js",
  "./js/creatures/octopus.js",
  "./js/creatures/seahorse.js",
  "./js/creatures/starfish.js",
  "./js/creatures/turtle.js",
  "./js/creatures/whale.js",
  "./js/data.js",
  "./js/storage.js",
  "./js/audio.js",
  "./js/appchunks/part1.js",
  "./js/appchunks/part2.js",
  "./js/appchunks/part3.js",
  "./js/appchunks/part4.js",
  "./js/appchunks/part5.js",
  "./js/appchunks/part6.js",
  "./js/app-loader.js",
  "./manifest.webmanifest",
  "./assets/ui/icon.svg"
];
self.addEventListener('install',e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS)).then(()=>self.skipWaiting())));
self.addEventListener('activate',e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())));
self.addEventListener('fetch',e=>{if(e.request.method!=='GET')return;e.respondWith(caches.match(e.request).then(r=>r||fetch(e.request).then(resp=>{const copy=resp.clone();caches.open(CACHE).then(c=>c.put(e.request,copy));return resp;}).catch(()=>caches.match('./index.html'))));});
