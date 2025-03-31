// // This is the service worker for PWA functionality

// const CACHE_NAME = "svg-generator-v1"

// // Add all static assets to cache during installation
// self.addEventListener("install", (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => {
//       return cache.addAll(["/", "/manifest.json", "/icon-192.png", "/icon-512.png"])
//     }),
//   )
// })

// // Network first, falling back to cache strategy
// self.addEventListener("fetch", (event) => {
//   event.respondWith(
//     fetch(event.request)
//       .then((response) => {
//         // If we got a valid response, clone it and put it in the cache
//         if (response && response.status === 200 && response.type === "basic") {
//           const responseToCache = response.clone()
//           caches.open(CACHE_NAME).then((cache) => {
//             cache.put(event.request, responseToCache)
//           })
//         }
//         return response
//       })
//       .catch(() => {
//         // If network request fails, try to get it from the cache
//         return caches.match(event.request)
//       }),
//   )
// })

// // Clean up old caches when a new service worker activates
// self.addEventListener("activate", (event) => {
//   const cacheWhitelist = [CACHE_NAME]
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cacheName) => {
//           if (cacheWhitelist.indexOf(cacheName) === -1) {
//             return caches.delete(cacheName)
//           }
//         }),
//       )
//     }),
//   )
// })

