// src/firebase/messaging.js

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "./config";

// ⚠️  غيّر ده بالـ VAPID Key الحقيقي — لازم يبدأ بـ B وطوله ~88 حرف
// من: Firebase Console → Project Settings → Cloud Messaging → Web Push certificates
const VAPID_KEY =
  "BLJW7H6cQHMIa-BFKHpHf7IgK8EW0gBFf3LF07lQhLXica8gKAiYD0-Z3X_FCWliChWe5Iqby3_X-jh6auIEdlA";

export const messaging = getMessaging(app);

/**
 * تطلب إذن الإشعارات وترجع الـ FCM Token
 * @returns {Promise<string|null>}
 */
export async function requestNotificationPermission() {
  try {
    // 1) تأكد إن المتصفح بيدعم Service Workers
    if (!("serviceWorker" in navigator)) {
      throw new Error("المتصفح ده مش بيدعم Service Workers");
    }

    // 2) اطلب إذن الإشعارات
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("تم رفض إذن الإشعارات");
    }

    // 3) سجّل الـ Service Worker وستنّى لحد ما يبقى active
    let registration = await navigator.serviceWorker.getRegistration(
      "/firebase-messaging-sw.js",
    );

    if (!registration) {
      registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js",
        { scope: "/" },
      );
    }

    // ستنّى لحد ما يبقى active (ده اللي بيحل مشكلة no active Service Worker)
    await navigator.serviceWorker.ready;

    // 4) جيب الـ FCM Token
    const token = await getToken(messaging, {
      vapidKey: VAPID_KEY,
      serviceWorkerRegistration: registration,
    });

    if (!token) throw new Error("فشل الحصول على Token — تأكد من الـ VAPID Key");

    return token;
  } catch (err) {
    console.error("[FCM] Error:", err.message);
    throw err;
  }
}

/**
 * استمع للإشعارات في الـ Foreground
 */
export function onForegroundMessage(callback) {
  return onMessage(messaging, callback);
}
