// This is the service worker for PWA functionality

const CACHE_NAME = "svg-generator-v3";

// Add all static assets to cache during installation
self.addEventListener("install", (event) => {
  console.log("Installing service worker");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        "/",
        "/manifest.json",
        "/logo.svg",
        "/gallery",
        "/my-images",
      ]);
    })
  );
});

// Network first, falling back to cache strategy
self.addEventListener("fetch", (event) => {
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        // If we got a valid response, clone it and put it in the cache
        if (response && response.status === 200 && response.type === "basic") {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        // If network request fails, try to get it from the cache
        // if it fails, return error
        return caches.match(event.request).then((response) => {
          if (response) {
            return response;
          }
          return new Response(
            JSON.stringify({
              message: "Схоже на те що ви у офлайн режимі",
              success: false,
              offline: true,
            }),
            {
              status: 503,
              headers: {
                "Content-Type": "application/json",
              },
            }
          );
        });
      })
  );
});

// Clean up old caches when a new service worker activates
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Обробка пуш-повідомлень
self.addEventListener("push", function (event) {
  if (event.data) {
    const data = event.data.json();

    if (data.body.type === "add_to_chat") {
    } else if (data.body.type === "general") {
      const options = {
        body: data.body.message,
        icon: data.icon || "/logo.svg",
        badge: "/logo.svg",
        vibrate: [100, 50, 100],
        data: {
          dateOfArrival: Date.now(),
          url: self.location.origin,
        },
      };
      event.waitUntil(self.registration.showNotification(data.title, options));
    }
  }
});

// Обробка кліків на повідомлення
self.addEventListener("notificationclick", function (event) {
  console.log("Notification click received.");
  event.notification.close();
  event.waitUntil(
    clients.matchAll({ type: "window" }).then(function (clientList) {
      // Якщо вікно вже відкрите - фокусуємось на ньому
      for (let i = 0; i < clientList.length; i++) {
        const client = clientList[i];
        if (client.url === event.notification.data.url && "focus" in client) {
          return client.focus();
        }
      }
      // Якщо вікно закрите - відкриваємо
      if (clients.openWindow) {
        return clients.openWindow(event.notification.data.url);
      }
    })
  );
});
