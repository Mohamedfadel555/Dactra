import { useRef, useState, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { IoNotificationsOutline } from "react-icons/io5";
import { useNotificationInbox } from "../../hooks/useNotificationInbox";
import { useAuth } from "../../Context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import {
  pickMessage as pickMessageRaw,
  resolveNotificationTarget,
} from "../../utils/notificationNavigation";

function pickId(n) {
  return n?.id ?? n?.Id;
}

function pickMessage(n) {
  const m = pickMessageRaw(n);
  return m || "Notification";
}

function pickTime(n) {
  const raw =
    n?.createdAtUtc ??
    n?.CreatedAtUtc ??
    n?.createdAt ??
    n?.CreatedAt ??
    n?.createdAtUTC;
  if (!raw) return "";
  try {
    return new Date(raw).toLocaleString();
  } catch {
    return "";
  }
}

function isUnread(n) {
  const v = n?.isRead ?? n?.IsRead;
  if (v === false) return true;
  if (v === true) return false;
  return !v;
}

export default function NotificationBell() {
  const { accessToken } = useAuth();
  const [open, setOpen] = useState(false);
  const rootRef = useRef(null);
  const navigate = useNavigate();
  const {
    items,
    unreadCount,
    isLoading,
    markRead,
    refetch,
    listError,
    countError,
    isError,
  } = useNotificationInbox();

  useEffect(() => {
    const h = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target))
        setOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  if (!accessToken) return null;

  const apiHint =
    isError && (listError || countError)
      ? listError || countError
      : null;

  return (
    <div className="relative" ref={rootRef}>
      <button
        type="button"
        onClick={() => {
          setOpen((o) => !o);
          if (!open) refetch();
        }}
        className="relative flex items-center justify-center w-10 h-10 rounded-full text-slate-600 hover:bg-slate-100/90 transition-colors border border-transparent hover:border-slate-200/80"
        title="Notifications"
        aria-label="Notifications"
      >
        <IoNotificationsOutline className="w-[22px] h-[22px]" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 flex items-center justify-center rounded-full bg-rose-500 text-[10px] font-bold text-white">
            {unreadCount > 99 ? "99+" : unreadCount}
          </span>
        )}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.98 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute right-0 top-[calc(100%+8px)] z-[60] w-[min(100vw-24px,360px)] max-h-[min(70vh,420px)] overflow-hidden flex flex-col bg-white rounded-2xl border border-slate-100 shadow-[0_4px_6px_rgba(0,0,0,0.05),0_20px_50px_rgba(0,0,0,0.12)]"
          >
            <div className="px-4 py-3 border-b border-slate-100 bg-slate-50/80 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <p className="text-sm font-bold text-slate-800">Notifications</p>
                <Link
                  to="/notifications"
                  onClick={() => setOpen(false)}
                  className="text-[11px] font-semibold text-[#316BE8] hover:underline"
                  title="Open notifications page"
                >
                  View all →
                </Link>
              </div>
              {unreadCount > 0 && (
                <span className="text-xs font-medium text-rose-600 shrink-0">
                  {unreadCount} unread
                </span>
              )}
            </div>
            {apiHint && (
              <div className="px-3 py-2 text-[11px] leading-snug text-amber-900 bg-amber-50 border-b border-amber-100">
                API: {apiHint} — Check Network tab for{" "}
                <code className="text-[10px]">/Notification/my</code> and token
                role (some roles may be blocked by backend).
              </div>
            )}
            <div className="overflow-y-auto flex-1">
              {isLoading && (
                <p className="p-4 text-sm text-slate-500">Loading…</p>
              )}
              {!isLoading && !apiHint && items.length === 0 && (
                <div className="p-4 text-sm text-slate-500 space-y-2">
                  <p>No notifications yet.</p>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    To verify the pipeline: publish an article or question (you
                    should get a self confirmation), like someone else&apos;s
                    article while logged in as patient, or book an appointment.
                    Then reopen this panel or wait for auto-refresh.
                  </p>
                </div>
              )}
              {items.map((n) => {
                const id = pickId(n);
                const unread = isUnread(n);
                const fallbackTarget = resolveNotificationTarget(n);
                return (
                  <button
                    type="button"
                    key={String(id ?? pickMessage(n) + pickTime(n))}
                    onClick={async () => {
                      let source = n;
                      if (id != null) {
                        try {
                          const res = await markRead(id);
                          source = res?.data?.data ?? res?.data ?? n;
                        } catch {
                          /* */
                        }
                      }
                      const target =
                        resolveNotificationTarget(source) || fallbackTarget;
                      if (target) {
                        setOpen(false);
                        navigate(target.to, { state: target.state });
                      }
                    }}
                    className={`w-full text-left px-4 py-3 border-b border-slate-50 hover:bg-slate-50/90 transition-colors ${
                      unread ? "bg-blue-100/70" : ""
                    }`}
                  >
                    <p className="text-[13px] text-slate-800 leading-snug">
                      {pickMessage(n)}
                    </p>
                    {pickTime(n) && (
                      <p className="text-[11px] text-slate-400 mt-1">
                        {pickTime(n)}
                      </p>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
