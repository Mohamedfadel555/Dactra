import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";
import {
  requestNotificationPermission,
  onForegroundMessage,
} from "../firebase/messaging";
import { useAuth } from "./AuthContext";

const BACKEND_URL = "https://dactra.runasp.net";
const STORAGE_KEY = "notifications_granted";

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [status, setStatus] = useState("idle");
  const [token, setToken] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);

  const { accessToken } = useAuth();
  const activatingRef = useRef(false);

  // ── listen for foreground messages ──────────────────────────────────────
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

  // ── core activate fn ────────────────────────────────────────────────────
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

  // ── auto-activate on mount if previously granted ─────────────────────────
  useEffect(() => {
    const previouslyGranted = localStorage.getItem(STORAGE_KEY) === "true";
    const browserPermission = Notification.permission;

    if (previouslyGranted && browserPermission === "granted") {
      // already granted — activate silently to get the token & set status
      activate(true);
    } else if (browserPermission === "granted" && !previouslyGranted) {
      // browser says granted but we lost the localStorage flag — re-activate
      activate(true);
    } else if (browserPermission === "denied") {
      setStatus("denied");
      setError(
        "Notification permission was denied. Please enable it in your browser settings.",
      );
      localStorage.removeItem(STORAGE_KEY);
    }
    // else: "default" → user hasn't decided yet → stay "idle"
  }, [activate]);

  return (
    <NotificationsContext.Provider
      value={{
        status,
        token,
        notifications,
        error,
        enableNotifications: () => activate(false),
      }}
    >
      {children}
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) {
    throw new Error(
      "useNotifications must be used inside <NotificationsProvider>",
    );
  }
  return ctx;
}
