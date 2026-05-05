// public/firebase-messaging-sw.js
// ============================================================
// ⚠️  الملف ده لازم يكون جوّا مجلد public/ في مشروع Vite/React
//     عشان يتعرض على /firebase-messaging-sw.js
// ⚠️  غيّر القيم بنفس القيم اللي في src/firebase/config.js
// ============================================================

importScripts(
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-app-compat.js",
  "https://www.gstatic.com/firebasejs/10.12.0/firebase-messaging-compat.js",
);

firebase.initializeApp(
  // For Firebase JS SDK v7.20.0 and later, measurementId is optional
  {
    apiKey: "AIzaSyCjRvJSuFoWSZd6jcKNG4NiM19mde4q_Z0",
    authDomain: "dactra-3f8aa.firebaseapp.com",
    projectId: "dactra-3f8aa",
    storageBucket: "dactra-3f8aa.firebasestorage.app",
    messagingSenderId: "1074038639427",
    appId: "1:1074038639427:web:b18b09921090ec143c3df6",
    measurementId: "G-W7R64Z6RNZ",
  },
);

const messaging = firebase.messaging();

// استقبال الإشعارات في الـ Background
messaging.onBackgroundMessage((payload) => {
  const title = payload.notification?.title ?? "إشعار جديد من دكترة";
  const body = payload.notification?.body ?? "";
  const icon = payload.notification?.icon ?? "/dactraIcon.webp";
  const url = payload.data?.url ?? "/";

  self.registration.showNotification(title, {
    body,
    icon,
    badge: "/dactraIcon.webp",
    tag: "dactara-notif",
    renotify: true,
    data: { url },
  });
});

// لما المستخدم يضغط على الإشعار
self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const targetUrl = event.notification.data?.url ?? "/";

  event.waitUntil(
    clients
      .matchAll({ type: "window", includeUncontrolled: true })
      .then((list) => {
        for (const client of list) {
          if (client.url === targetUrl && "focus" in client)
            return client.focus();
        }
        return clients.openWindow(targetUrl);
      }),
  );
});

self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (e) => e.waitUntil(clients.claim()));
