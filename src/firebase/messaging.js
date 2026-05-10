// src/firebase/messaging.js

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import app from "./config";

const VAPID_KEY =
  "BLJW7H6cQHMIa-BFKHpHf7IgK8EW0gBFf3LF07lQhLXica8gKAiYD0-Z3X_FCWliChWe5Iqby3_X-jh6auIEdlA";

export const messaging = getMessaging(app);

/**
 * Requests notification permission and returns the FCM token.
 * Returns null if permission is denied (does NOT throw).
 * Throws only on unexpected errors (SW failure, bad VAPID key, etc.)
 *
 * @returns {Promise<string|null>}
 */
export async function requestNotificationPermission() {
  // 1) Check Service Worker support
  if (!("serviceWorker" in navigator)) {
    throw new Error("This browser does not support Service Workers.");
  }

  // 2) Request permission — return null if denied (not an error)
  const permission = await Notification.requestPermission();
  if (permission !== "granted") {
    return null;
  }

  // 3) Register / reuse the Service Worker
  let registration = await navigator.serviceWorker.getRegistration(
    "/firebase-messaging-sw.js",
  );

  if (!registration) {
    registration = await navigator.serviceWorker.register(
      "/firebase-messaging-sw.js",
      { scope: "/" },
    );
  }

  // Wait until the SW is active
  await navigator.serviceWorker.ready;

  // 4) Get the FCM token
  const token = await getToken(messaging, {
    vapidKey: VAPID_KEY,
    serviceWorkerRegistration: registration,
  });

  if (!token) {
    throw new Error("Failed to get FCM token — check your VAPID key.");
  }

  return token;
}

/**
 * Listen for foreground messages.
 * @param {(payload: import("firebase/messaging").MessagePayload) => void} callback
 * @returns {() => void} unsubscribe function
 */
export function onForegroundMessage(callback) {
  return onMessage(messaging, callback);
}
