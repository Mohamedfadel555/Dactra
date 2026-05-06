import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiRefreshCw,
  FiCheckCircle,
  FiAlertCircle,
  FiCalendar,
  FiMessageSquare,
  FiUser,
  FiInfo,
  FiChevronRight,
  FiInbox,
} from "react-icons/fi";
import { useNotificationInbox } from "../../hooks/useNotificationInbox";
import { useAuth } from "../../Context/AuthContext";
import {
  pickMessage as pickMessageRaw,
  resolveNotificationTarget,
} from "../../utils/notificationNavigation";

// ─── Helpers ────────────────────────────────────────────────────────────────

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
    const date = new Date(raw);
    const now = new Date();
    const diffMs = now - date;
    const diffMin = Math.floor(diffMs / 60_000);
    const diffHr = Math.floor(diffMs / 3_600_000);
    const diffDay = Math.floor(diffMs / 86_400_000);

    if (diffMin < 1) return "Just now";
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHr < 24) return `${diffHr}h ago`;
    if (diffDay < 7) return `${diffDay}d ago`;
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    });
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

function getNotificationType(n) {
  const type = (n?.type ?? n?.Type ?? "").toLowerCase();
  const msg = pickMessage(n).toLowerCase();

  if (
    type.includes("booking") ||
    msg.includes("appointment") ||
    msg.includes("book")
  )
    return "appointment";
  if (
    type.includes("community") ||
    msg.includes("comment") ||
    msg.includes("like") ||
    msg.includes("post")
  )
    return "community";
  if (
    type.includes("user") ||
    msg.includes("welcome") ||
    msg.includes("register")
  )
    return "user";
  if (type.includes("cancel") || msg.includes("cancel")) return "cancel";
  return "general";
}

const TYPE_CONFIG = {
  appointment: {
    icon: FiCalendar,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100",
    dot: "bg-blue-500",
  },
  community: {
    icon: FiMessageSquare,
    color: "text-indigo-600",
    bg: "bg-indigo-50",
    border: "border-indigo-100",
    dot: "bg-indigo-500",
  },
  user: {
    icon: FiUser,
    color: "text-teal-600",
    bg: "bg-teal-50",
    border: "border-teal-100",
    dot: "bg-teal-500",
  },
  cancel: {
    icon: FiAlertCircle,
    color: "text-rose-500",
    bg: "bg-rose-50",
    border: "border-rose-100",
    dot: "bg-rose-500",
  },
  general: {
    icon: FiInfo,
    color: "text-slate-500",
    bg: "bg-slate-50",
    border: "border-slate-100",
    dot: "bg-slate-400",
  },
};

// ─── Sub-components ──────────────────────────────────────────────────────────

function NotificationSkeleton() {
  return (
    <div className="px-5 py-4 border-b border-slate-100 last:border-0 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-10 h-10 rounded-2xl bg-slate-100 shrink-0" />
        <div className="flex-1 space-y-2 pt-1">
          <div className="h-3.5 bg-slate-100 rounded-full w-3/4" />
          <div className="h-3 bg-slate-100 rounded-full w-1/3" />
        </div>
      </div>
    </div>
  );
}

function NotificationItem({ n, index, onNavigate }) {
  const id = pickId(n);
  const unread = isUnread(n);
  const target = resolveNotificationTarget(n);
  const type = getNotificationType(n);
  const cfg = TYPE_CONFIG[type];
  const Icon = cfg.icon;

  return (
    <motion.button
      key={String(id ?? pickMessage(n) + pickTime(n))}
      type="button"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.22, delay: index * 0.04, ease: "easeOut" }}
      onClick={() => onNavigate(n, id, target)}
      className={`w-full text-left px-5 py-4 border-b border-slate-100 last:border-0 transition-all duration-150 group relative ${
        unread
          ? "bg-blue-50/60 hover:bg-blue-50"
          : "bg-white hover:bg-slate-50/80"
      }`}
    >
      {/* Unread left accent bar */}
      {unread && (
        <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-blue-500" />
      )}

      <div className="flex items-start gap-4">
        {/* Icon badge */}
        <div
          className={`w-10 h-10 rounded-2xl ${cfg.bg} ${cfg.border} border flex items-center justify-center shrink-0`}
        >
          <Icon className={`w-[18px] h-[18px] ${cfg.color}`} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p
            className={`text-[13.5px] leading-snug truncate ${
              unread
                ? "font-semibold text-slate-900"
                : "font-medium text-slate-700"
            }`}
          >
            {pickMessage(n)}
          </p>

          {pickTime(n) && (
            <p className="text-[11.5px] text-slate-400 mt-1 font-medium">
              {pickTime(n)}
            </p>
          )}
        </div>

        {/* Arrow */}
        {target && (
          <FiChevronRight className="w-4 h-4 text-slate-300 group-hover:text-blue-400 transition-colors shrink-0 mt-1" />
        )}
      </div>
    </motion.button>
  );
}

// ─── Main Page ───────────────────────────────────────────────────────────────

export default function NotificationsPage() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();

  const {
    items,
    unreadCount,
    isLoading,
    isFetching,
    isError,
    listError,
    markRead,
    refetch,
  } = useNotificationInbox();

  const sorted = useMemo(() => {
    const arr = Array.isArray(items) ? [...items] : [];
    arr.sort((a, b) => {
      const ta = new Date(
        a?.createdAtUtc ?? a?.CreatedAtUtc ?? a?.createdAt ?? a?.CreatedAt ?? 0,
      ).getTime();
      const tb = new Date(
        b?.createdAtUtc ?? b?.CreatedAtUtc ?? b?.createdAt ?? b?.CreatedAt ?? 0,
      ).getTime();
      return tb - ta;
    });
    return arr;
  }, [items]);

  const unreadItems = sorted.filter(isUnread);
  const readItems = sorted.filter((n) => !isUnread(n));

  async function handleNavigate(n, id, target) {
    let source = n;
    if (id != null) {
      try {
        const res = await markRead(id);
        source = res?.data?.data ?? res?.data ?? n;
      } catch {
        /* ignore */
      }
    }
    const next = resolveNotificationTarget(source) || target;
    if (next) navigate(next.to, { state: next.state });
  }

  // ── Not authenticated ──
  if (!accessToken) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/30 pt-[90px] px-4">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-12 text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <FiBell className="w-7 h-7 text-blue-400" />
            </div>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Sign in to view notifications
            </h2>
            <p className="text-sm text-slate-500">
              Your notifications will appear here once you're signed in.
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/20 pt-[90px] px-4 pb-20">
      <div className="max-w-2xl mx-auto">
        {/* ── Header ── */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <div>
            <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
              Notifications
            </h1>
            <p className="text-[12.5px] text-slate-400 mt-0.5 font-medium">
              {unreadCount > 0
                ? `${unreadCount} unread message${unreadCount > 1 ? "s" : ""}`
                : "All caught up"}
            </p>
          </div>

          <motion.button
            whileTap={{ scale: 0.94 }}
            type="button"
            onClick={refetch}
            disabled={isFetching}
            className="flex items-center gap-2 h-10 px-4 rounded-2xl bg-white border border-slate-200 text-[13px] font-semibold text-slate-600 hover:border-blue-200 hover:text-blue-600 transition-all shadow-sm disabled:opacity-60"
          >
            <motion.span
              animate={{ rotate: isFetching ? 360 : 0 }}
              transition={{
                repeat: isFetching ? Infinity : 0,
                duration: 0.8,
                ease: "linear",
              }}
            >
              <FiRefreshCw className="w-3.5 h-3.5" />
            </motion.span>
            Refresh
          </motion.button>
        </motion.div>

        {/* ── Error Banner ── */}
        <AnimatePresence>
          {isError && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 overflow-hidden"
            >
              <div className="flex items-center gap-3 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl px-4 py-3 text-[13px] font-medium">
                <FiAlertCircle className="w-4 h-4 shrink-0" />
                {listError ||
                  "Could not load notifications. Please try refreshing."}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── Loading Skeleton ── */}
        {isLoading ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden"
          >
            {[...Array(5)].map((_, i) => (
              <NotificationSkeleton key={i} />
            ))}
          </motion.div>
        ) : sorted.length === 0 ? (
          /* ── Empty State ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.97 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-3xl border border-slate-100 shadow-sm p-14 text-center"
          >
            <div className="w-16 h-16 rounded-3xl bg-blue-50 flex items-center justify-center mx-auto mb-5">
              <FiInbox className="w-7 h-7 text-blue-300" />
            </div>
            <h3 className="text-[15px] font-bold text-slate-700 mb-1.5">
              No notifications yet
            </h3>
            <p className="text-[13px] text-slate-400">
              We'll notify you about appointments, messages, and more.
            </p>
          </motion.div>
        ) : (
          /* ── Notification List ── */
          <div className="space-y-5">
            {/* Unread section */}
            {unreadItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
              >
                <div className="flex items-center gap-2 mb-2 px-1">
                  <span className="text-[11px] font-bold text-blue-500 uppercase tracking-widest">
                    New
                  </span>
                  <span className="w-5 h-5 rounded-full bg-blue-500 text-white text-[10px] font-bold flex items-center justify-center">
                    {unreadItems.length}
                  </span>
                </div>
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <AnimatePresence initial={false}>
                    {unreadItems.map((n, i) => (
                      <NotificationItem
                        key={String(pickId(n) ?? pickMessage(n) + pickTime(n))}
                        n={n}
                        index={i}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* Read section */}
            {readItems.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25, delay: 0.08 }}
              >
                {unreadItems.length > 0 && (
                  <div className="px-1 mb-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Earlier
                    </span>
                  </div>
                )}
                <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
                  <AnimatePresence initial={false}>
                    {readItems.map((n, i) => (
                      <NotificationItem
                        key={String(pickId(n) ?? pickMessage(n) + pickTime(n))}
                        n={n}
                        index={i}
                        onNavigate={handleNavigate}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </motion.div>
            )}

            {/* All-read confirmation */}
            {unreadCount === 0 && sorted.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex items-center justify-center gap-2 py-3 text-[12.5px] text-slate-400 font-medium"
              >
                <FiCheckCircle className="w-3.5 h-3.5 text-teal-400" />
                All notifications have been read
              </motion.div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
