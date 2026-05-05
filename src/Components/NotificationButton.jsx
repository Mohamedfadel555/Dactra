// src/components/NotificationButton.jsx
// ─────────────────────────────────────────────────────────────
// Drop anywhere: <NotificationButton />
// After the user clicks once and approves, subsequent visits
// silently re-activate without any prompt.
// ─────────────────────────────────────────────────────────────

import { useNotifications } from "../hooks/useNotifications";
import styles from "./NotificationButton.module.css";

export default function NotificationButton() {
  const { status, token, notifications, error, enableNotifications } =
    useNotifications();

  const isLoading = status === "loading";
  const isGranted = status === "granted";
  const isDenied = status === "denied";

  // ── If already granted (auto-activated on mount), render nothing ──
  // Remove this block if you still want to show the "active" badge.
  if (isGranted && !notifications.length) return null;

  return (
    <div className={styles.wrapper}>
      {/* ── Activation button (hidden once granted) ── */}
      {!isGranted && (
        <button
          className={styles.btn}
          onClick={enableNotifications}
          disabled={isLoading || isDenied}
        >
          {isLoading && <span className={styles.spinner} />}
          {!isLoading && "🔔 Enable Notifications"}
        </button>
      )}

      {/* ── Permission denied message ── */}
      {isDenied && (
        <p className={styles.error}>
          {error ??
            "Notification permission was denied. Please enable it in your browser settings."}
        </p>
      )}

      {/* ── FCM Token display (optional debug info) ── */}
      {isGranted && token && (
        <div className={styles.tokenBox}>
          <span className={styles.tokenLabel}>FCM Token</span>
          <code className={styles.token}>{token.slice(0, 40)}…</code>
        </div>
      )}

      {/* ── Foreground notification list ── */}
      {notifications.length > 0 && (
        <ul className={styles.list}>
          {notifications.map((n) => (
            <li key={n.id} className={styles.item}>
              <strong>{n.title}</strong>
              <p>{n.body}</p>
              <small>{n.time}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
