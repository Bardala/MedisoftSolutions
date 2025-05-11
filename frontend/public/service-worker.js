// public/service-worker.js

/* eslint-disable no-restricted-globals */
const CACHE_NAME = "my-app-cache-v1";
const urlsToCache = [
  "/",
  "/index.html",
  "/static/js/bundle.js",
  "/notification-icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache)),
  );
});

self.addEventListener("push", (event) => {
  const data = event.data?.json();
  const options = {
    body: data.body,
    icon: "/notification-icon.png",
    badge: "/notification-badge.png",
    vibrate: [200, 100, 200],
    data: {
      url: data.url || "/",
    },
  };
  event.waitUntil(self.registration.showNotification(data.title, options));
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  event.waitUntil(self.clients.openWindow(event.notification.data.url));
});
