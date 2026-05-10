import { motion, AnimatePresence } from "framer-motion";
import {
  FiBell,
  FiBellOff,
  FiAlertCircle,
  FiCheckCircle,
  FiClock,
  FiCalendar,
} from "react-icons/fi";
// import { useNotifications } from "../../hooks/useNotifications";
import { useNotifications } from "../Context/NotificationsContext";
// import { useNotificationsApi } from "../hooks/useNotificationsApi";
import { FaPills } from "react-icons/fa";

// ─── feature pills shown in the card ────────────────────────────────────────

const FEATURES = [
  {
    Icon: FiCalendar,
    label: "Appointment reminders",
    desc: "Get notified before your booking",
    color: "#3b82f6",
    bg: "#eff6ff",
  },
  {
    Icon: FaPills,
    label: "Medication reminders",
    desc: "Never miss a dose",
    color: "#10b981",
    bg: "#ecfdf5",
  },
  {
    Icon: FiClock,
    label: "Real-time updates",
    desc: "Doctor confirmations & changes",
    color: "#8b5cf6",
    bg: "#f5f3ff",
  },
];

// ─── status config ────────────────────────────────────────────────────────────

function getStatusConfig(status, error) {
  switch (status) {
    case "granted":
      return {
        icon: FiCheckCircle,
        iconColor: "#10b981",
        bg: "#ecfdf5",
        border: "#a7f3d0",
        text: "Notifications are active",
        sub: "You'll receive reminders for appointments and medications.",
      };
    case "denied":
      return {
        icon: FiBellOff,
        iconColor: "#ef4444",
        bg: "#fef2f2",
        border: "#fecaca",
        text: "Notifications are blocked",
        sub: "Enable them from your browser settings to stay updated.",
      };
    case "error":
      return {
        icon: FiAlertCircle,
        iconColor: "#f59e0b",
        bg: "#fffbeb",
        border: "#fde68a",
        text: "Something went wrong",
        sub: error ?? "Please try again.",
      };
    default:
      return null;
  }
}

// ─── component ───────────────────────────────────────────────────────────────

export default function NotificationsCard() {
  const { status, error, enableNotifications } = useNotifications();

  const isLoading = status === "loading";
  const isGranted = status === "granted";
  const isDenied = status === "denied";
  const isIdle = status === "idle";

  const statusConfig = getStatusConfig(status, error);
  const canEnable = isIdle || status === "error";

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden"
    >
      {/* ── header ── */}
      <div className="px-5 pt-5 pb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {/* bell icon with pulse when idle/not granted */}
          <div className="relative flex-shrink-0">
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                isGranted ? "bg-emerald-50" : "bg-blue-50"
              }`}
            >
              {isGranted ? (
                <FiCheckCircle className="w-5 h-5 text-emerald-500" />
              ) : (
                <FiBell className="w-5 h-5 text-blue-600" />
              )}
            </div>
            {/* pulse ring when not enabled yet */}
            {!isGranted && !isDenied && (
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-blue-500 ring-2 ring-white animate-pulse" />
            )}
          </div>

          <div>
            <p className="text-[13px] font-semibold text-gray-800">
              Stay Notified
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Smart health reminders
            </p>
          </div>
        </div>

        {/* status badge */}
        <AnimatePresence mode="wait">
          {isGranted && (
            <motion.span
              key="active-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wide flex-shrink-0"
            >
              Active
            </motion.span>
          )}
          {isDenied && (
            <motion.span
              key="blocked-badge"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-red-50 text-red-500 border border-red-100 uppercase tracking-wide flex-shrink-0"
            >
              Blocked
            </motion.span>
          )}
        </AnimatePresence>
      </div>

      <div className="px-5 pb-5 flex flex-col gap-4">
        {/* ── feature pills (hide when granted) ── */}
        <AnimatePresence>
          {!isGranted && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-2.5 overflow-hidden"
            >
              {FEATURES.map(({ Icon, label, desc, color, bg }) => (
                <div key={label} className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                    style={{ background: bg }}
                  >
                    <Icon className="w-3.5 h-3.5" style={{ color }} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[12px] font-semibold text-gray-700 leading-none">
                      {label}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>
                  </div>
                </div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── status banner (granted / denied / error) ── */}
        <AnimatePresence>
          {statusConfig && (
            <motion.div
              key={status}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.25 }}
              className="flex items-start gap-2.5 rounded-xl px-3.5 py-3 text-[12px] font-medium"
              style={{
                background: statusConfig.bg,
                border: `1px solid ${statusConfig.border}`,
              }}
            >
              <statusConfig.icon
                className="w-4 h-4 mt-0.5 flex-shrink-0"
                style={{ color: statusConfig.iconColor }}
              />
              <div>
                <p
                  className="font-semibold text-[12px]"
                  style={{ color: statusConfig.iconColor }}
                >
                  {statusConfig.text}
                </p>
                <p className="text-gray-500 mt-0.5 text-[11px]">
                  {statusConfig.sub}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ── CTA button ── */}
        <AnimatePresence>
          {!isGranted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.button
                type="button"
                onClick={enableNotifications}
                disabled={isLoading || isDenied}
                whileHover={
                  !isLoading && !isDenied ? { y: -1, scale: 1.01 } : {}
                }
                whileTap={!isLoading && !isDenied ? { scale: 0.98 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className={`w-full h-10 rounded-xl text-[13px] font-semibold flex items-center justify-center gap-2 transition-colors shadow-sm
                  ${
                    isDenied
                      ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                      : isLoading
                        ? "bg-blue-500 text-white cursor-wait"
                        : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer shadow-blue-200/60"
                  }
                  disabled:opacity-70`}
              >
                {isLoading ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        repeat: Infinity,
                        duration: 0.7,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
                    />
                    Enabling…
                  </>
                ) : isDenied ? (
                  <>
                    <FiBellOff className="w-4 h-4" />
                    Blocked by browser
                  </>
                ) : (
                  <>
                    <FiBell className="w-4 h-4" />
                    Enable Notifications
                  </>
                )}
              </motion.button>

              {/* hint under button for denied state */}
              <AnimatePresence>
                {isDenied && (
                  <motion.p
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="text-[11px] text-gray-400 text-center mt-2 leading-relaxed overflow-hidden"
                  >
                    Go to{" "}
                    <span className="font-semibold text-gray-500">
                      Browser Settings → Site Permissions → Notifications
                    </span>{" "}
                    and allow this site.
                  </motion.p>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
