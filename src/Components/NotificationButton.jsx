import { motion, AnimatePresence } from "framer-motion";
import { FiBell, FiBellOff, FiAlertCircle } from "react-icons/fi";
import { useNotifications } from "../hooks/useNotifications";

export default function NotificationsWidget() {
  const { status, token, error, enableNotifications } = useNotifications();

  const isLoading = status === "loading";
  const isGranted = status === "granted";
  const isDenied = status === "denied";
  const isError = status === "error";

  if (isGranted && !error) return null;

  return (
    <div className="flex flex-col gap-3 font-sans">
      {!isGranted && (
        <motion.button
          whileTap={{ scale: 0.96 }}
          whileHover={{ scale: 1.02 }}
          type="button"
          onClick={enableNotifications}
          disabled={isLoading || isDenied}
          className={`
            inline-flex items-center justify-center gap-2.5
            h-11 px-6 rounded-2xl text-[14px] font-semibold
            transition-colors shadow-sm select-none
            ${
              isDenied || isError
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
            }
            disabled:opacity-60 disabled:cursor-not-allowed
          `}
        >
          {isLoading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{
                  repeat: Infinity,
                  duration: 0.75,
                  ease: "linear",
                }}
                className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block"
              />
              <span>Enabling…</span>
            </>
          ) : (
            <>
              {isDenied ? (
                <FiBellOff className="w-4 h-4" />
              ) : (
                <FiBell className="w-4 h-4" />
              )}
              {isDenied ? "Notifications Blocked" : "Enable Notifications"}
            </>
          )}
        </motion.button>
      )}

      <AnimatePresence>
        {(isDenied || isError) && error && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="flex items-start gap-2.5 bg-rose-50 border border-rose-100 text-rose-700 rounded-2xl px-4 py-3 text-[12.5px] font-medium"
          >
            <FiAlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {isGranted && token && process.env.NODE_ENV === "development" && (
        <div className="flex flex-col gap-1 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-3">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            FCM Token
          </span>
          <code className="text-[11.5px] text-blue-500 break-all font-mono">
            {token.slice(0, 48)}…
          </code>
        </div>
      )}
    </div>
  );
}
