let files = ['/static/js/login.js'];

const cacheName = "static-v1";
this.addEventListener('install', function(event) {
  console.log('installing...');
  event.waitUntil(caches.open(cacheName)
    .then(function(cache) {
      console.log('Caching app ok');
      return cache.addAll(files);
    })
  );
  // self.skipWaiting();
});

// this.addEventListener('fetch', function(event) {
//   console.log('fetch start');
//   event.respondWith(caches.match(event.request)
//     .then(function(response) {
//       if (response)
//         return reponse;
//       return fetch(event.request)
//     }));
// });

// this.addEventListener('activate', function(event) {

//   event.waitUntil(
//     caches.keys().then(function(keyList) {
//       return Promise.all(keyList.map(function(key) {
//         if (cacheName.indexOf(key) === -1) {
//           return caches.delete(key);
//         }
//       }));
//     })
//   );
//   console.log('activated!');
// });