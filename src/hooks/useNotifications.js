import { useState, useEffect, useCallback, useRef } from "react";
import {
  requestNotificationPermission,
  onForegroundMessage,
} from "../firebase/messaging";
import { useAuth } from "../Context/AuthContext";

const BACKEND_URL = "https://dactra.runasp.net";
const STORAGE_KEY = "notifications_granted";

/**
 * @typedef {Object} NotificationItem
 * @property {string} id
 * @property {string} title
 * @property {string} body
 * @property {string} time
 */

export function useNotifications() {
  const [status, setStatus] = useState("idle");
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState(
    /** @type {NotificationItem[]} */ ([]),
  );
  const [error, setError] = useState(null);

  const { accessToken } = useAuth();

  const activatingRef = useRef(false);

  useEffect(() => {
    const unsubscribe = onForegroundMessage((payload) => {
      const title = payload.notification?.title ?? "New notification";
      const body = payload.notification?.body ?? "";

      setNotifications((prev) => [
        {
          id: crypto.randomUUID(),
          title,
          body,
          time: new Date().toLocaleTimeString("en-US"),
        },
        ...prev,
      ]);
    });

    return unsubscribe;
  }, []);

  const activate = useCallback(
    async (silent = false) => {
      if (activatingRef.current) return;
      activatingRef.current = true;

      if (!silent) {
        setStatus("loading");
        setError(null);
      }

      try {
        const fcmToken = await requestNotificationPermission();

        if (!fcmToken) {
          setStatus("denied");
          setError(
            "Notification permission was denied. Please enable it in your browser settings.",
          );
          localStorage.removeItem(STORAGE_KEY);
          return;
        }

        setToken(fcmToken);
        setStatus("granted");
        localStorage.setItem(STORAGE_KEY, "true");

        if (accessToken) {
          fetch(`${BACKEND_URL}/notifications/save-token`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ token: fcmToken }),
          }).catch((err) => {
            console.warn("[FCM] Could not save token to backend:", err);
          });
        }
      } catch (err) {
        setStatus("error");
        setError(err?.message ?? "Something went wrong.");
        console.error("[FCM] Activation error:", err);
      } finally {
        activatingRef.current = false;
      }
    },
    [accessToken],
  );

  useEffect(() => {
    const previouslyGranted = localStorage.getItem(STORAGE_KEY) === "true";
    const browserPermission = Notification.permission;

    if (previouslyGranted && browserPermission === "granted") {
      activate(true);
    } else if (browserPermission === "denied") {
      setStatus("denied");
      setError(
        "Notification permission was denied. Please enable it in your browser settings.",
      );
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [activate]);

  return {
    status,
    token,
    notifications,
    error,
    enableNotifications: () => activate(false),
  };
}
