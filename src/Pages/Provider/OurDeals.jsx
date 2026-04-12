import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegClock } from "react-icons/fa6";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { TbCancel } from "react-icons/tb";
import {
  MdPercent,
  MdCalendarToday,
  MdEdit,
  MdClose,
  MdCheck,
  MdInfo,
} from "react-icons/md";

// ─── mock data ────────────────────────────────────────────────────────────────
const MOCK_DEALS = [
  {
    _id: "1",
    status: "pending",
    doctor: { name: "Dr. Ahmed Saber", specialization: "Cardiologist" },
    discount: 25,
    description: "25% off all cardiac lab panels for referred patients.",
    startDate: "2025-06-01",
    endDate: "2025-09-01",
    createdAt: "2025-05-10",
  },
  {
    _id: "2",
    status: "pending",
    doctor: { name: "Dr. Mona Khalil", specialization: "Endocrinologist" },
    discount: 15,
    description: "Discount on thyroid & diabetes tests.",
    startDate: null,
    endDate: null,
    createdAt: "2025-05-14",
  },
  {
    _id: "3",
    status: "counter",
    doctor: { name: "Dr. Omar Nasser", specialization: "Nephrologist" },
    discount: 30,
    description: "Kidney function full panel at reduced rate.",
    counterDiscount: 20,
    counterDescription: "We can only offer 20% — full panel still included.",
    startDate: "2025-07-01",
    endDate: "2025-12-31",
    createdAt: "2025-05-08",
  },
  {
    _id: "4",
    status: "counter",
    doctor: { name: "Dr. Sara Mostafa", specialization: "Hematologist" },
    discount: 40,
    description: "40% off all CBC and coagulation tests.",
    counterDiscount: 30,
    counterDescription: "Maximum we can do is 30% — still a great deal.",
    startDate: null,
    endDate: null,
    createdAt: "2025-05-12",
  },
  {
    _id: "5",
    status: "rejected",
    doctor: { name: "Dr. Karim Adel", specialization: "Pulmonologist" },
    discount: 20,
    description: "Pulmonary function + ABG tests discounted.",
    startDate: "2025-06-15",
    endDate: "2025-08-15",
    createdAt: "2025-05-02",
  },
];

// ─── constants ────────────────────────────────────────────────────────────────
const TABS = [
  { key: "pending", label: "Pending", icon: FaRegClock, color: "amber" },
  {
    key: "counter",
    label: "Counter",
    icon: PiArrowsCounterClockwise,
    color: "violet",
  },
  { key: "rejected", label: "Rejected", icon: TbCancel, color: "rose" },
];

const TAB_STYLES = {
  amber: {
    active: "bg-amber-500  text-white",
    inactive: "text-amber-600  hover:bg-amber-50",
    badge: "bg-amber-100  text-amber-700",
  },
  violet: {
    active: "bg-violet-500 text-white",
    inactive: "text-violet-600 hover:bg-violet-50",
    badge: "bg-violet-100 text-violet-700",
  },
  rose: {
    active: "bg-rose-500   text-white",
    inactive: "text-rose-600   hover:bg-rose-50",
    badge: "bg-rose-100   text-rose-700",
  },
};

const STATUS_META = {
  pending: {
    label: "Awaiting",
    bg: "bg-amber-50",
    border: "border-amber-200",
    dot: "bg-amber-400",
    text: "text-amber-700",
  },
  counter: {
    label: "Counter Offer",
    bg: "bg-violet-50",
    border: "border-violet-200",
    dot: "bg-violet-500",
    text: "text-violet-700",
  },
  rejected: {
    label: "Rejected",
    bg: "bg-rose-50",
    border: "border-rose-200",
    dot: "bg-rose-400",
    text: "text-rose-700",
  },
};

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

const initials = (name = "") =>
  name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ cls = "border-white/30 border-t-white" }) {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      className={`w-4 h-4 border-2 ${cls} rounded-full inline-block shrink-0`}
    />
  );
}

// ─── CounterModal ─────────────────────────────────────────────────────────────
function CounterModal({ deal, onClose }) {
  const [loading, setLoading] = useState(null);
  const [done, setDone] = useState(null);

  const act = async (type) => {
    setLoading(type);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(null);
    setDone(type);
    setTimeout(() => onClose(type), 1600);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm flex items-end sm:items-center justify-center sm:p-4"
      onClick={(e) => e.target === e.currentTarget && onClose(null)}
    >
      <motion.div
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 50, opacity: 0 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="w-full sm:max-w-[480px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col"
      >
        {done ? (
          /* ── result screen ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center gap-4 py-14 px-8 text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 300,
                damping: 18,
                delay: 0.05,
              }}
              className="relative w-[68px] h-[68px]"
            >
              <motion.span
                className={`absolute inset-0 rounded-full ${done === "accepted" ? "bg-green-400/20" : "bg-rose-400/15"}`}
                animate={{ scale: [1, 2.1], opacity: [0.5, 0] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <div
                className={`relative w-full h-full rounded-full flex items-center justify-center
                ${done === "accepted" ? "bg-gradient-to-br from-green-400 to-green-600" : "bg-gradient-to-br from-rose-400 to-rose-600"}`}
              >
                {done === "accepted" ? (
                  <MdCheck size={28} color="#fff" />
                ) : (
                  <MdClose size={26} color="#fff" />
                )}
              </div>
            </motion.div>
            <p className="text-lg font-bold text-gray-900">
              {done === "accepted" ? "Counter Accepted!" : "Counter Rejected"}
            </p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              {done === "accepted"
                ? `You've accepted the counter offer of ${deal.counterDiscount}% discount from ${deal.doctor.name}.`
                : `You've rejected the counter offer from ${deal.doctor.name}.`}
            </p>
          </motion.div>
        ) : (
          <>
            {/* drag handle */}
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-violet-100 to-violet-200 flex items-center justify-center text-sm font-bold text-violet-700 shrink-0">
                  {initials(deal.doctor.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-tight truncate">
                    Counter Offer
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {deal.doctor.name} · {deal.doctor.specialization}
                  </p>
                </div>
              </div>
              <button
                onClick={() => onClose(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer shrink-0 ml-2"
              >
                <MdClose size={17} />
              </button>
            </div>

            {/* body — scrollable */}
            <div className="px-4 sm:px-5 py-4 flex flex-col gap-3 overflow-y-auto flex-1">
              {/* original offer */}
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider mb-2">
                  Your Original Offer
                </p>
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-gray-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl font-bold text-gray-500 leading-none">
                      {deal.discount}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-gray-400">
                      % OFF
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-through flex-1">
                    {deal.description}
                  </p>
                </div>
              </div>

              {/* counter */}
              <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 sm:p-4">
                <p className="text-[10px] sm:text-[11px] text-violet-500 uppercase tracking-wider mb-2">
                  Doctor's Counter
                </p>
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-violet-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl font-bold text-violet-600 leading-none">
                      {deal.counterDiscount}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-violet-400">
                      % OFF
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-violet-700 leading-relaxed flex-1">
                    {deal.counterDescription}
                  </p>
                </div>
              </div>

              {/* info */}
              <div className="flex gap-2 items-start bg-sky-50 border border-sky-200 rounded-xl px-3 sm:px-3.5 py-2.5">
                <MdInfo size={14} className="text-sky-500 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-700 leading-relaxed">
                  Accepting will activate the deal at the doctor's proposed
                  discount rate.
                </p>
              </div>
            </div>

            {/* footer */}
            <div className="flex gap-2 sm:gap-2.5 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 shrink-0">
              <motion.button
                whileTap={{ scale: 0.97 }}
                disabled={!!loading}
                onClick={() => act("rejected")}
                className="flex-1 py-2.5 text-sm font-medium rounded-xl border border-rose-200 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-colors disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                {loading === "rejected" ? (
                  <Spinner cls="border-rose-300 border-t-rose-500" />
                ) : (
                  <>
                    <MdClose size={15} /> Reject
                  </>
                )}
              </motion.button>
              <motion.button
                whileTap={{ scale: 0.97 }}
                whileHover={{ y: -1 }}
                disabled={!!loading}
                onClick={() => act("accepted")}
                className="flex-[2] py-2.5 text-sm font-semibold rounded-xl bg-gradient-to-r from-violet-500 to-violet-600 text-white flex items-center justify-center gap-2 shadow-[0_4px_14px_rgba(139,92,246,.3)] disabled:opacity-50 cursor-pointer"
              >
                {loading === "accepted" ? (
                  <Spinner />
                ) : (
                  <>
                    <MdCheck size={15} /> Accept Counter
                  </>
                )}
              </motion.button>
            </div>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── DealCard ─────────────────────────────────────────────────────────────────
function DealCard({ deal, index, onCounter }) {
  const meta = STATUS_META[deal.status];

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        delay: index * 0.055,
        duration: 0.3,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative rounded-2xl border ${meta.border} ${meta.bg} p-3.5 sm:p-4 flex flex-col gap-2.5 sm:gap-3 overflow-hidden`}
    >
      {/* dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* ── top row: avatar + name + status pill ── */}
      <div className="flex items-start justify-between gap-2 relative">
        {/* left: avatar + name */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-600 shrink-0">
            {initials(deal.doctor.name)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
              {deal.doctor.name}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {deal.doctor.specialization}
            </p>
          </div>
        </div>

        {/* right: status pill — always visible, wraps gracefully */}
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-white border ${meta.border} ${meta.text} shrink-0`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} shrink-0`} />
          <span className="whitespace-nowrap">{meta.label}</span>
        </div>
      </div>

      {/* ── discount + description ── */}
      <div className="flex items-start sm:items-center gap-3 relative">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white shadow-sm border border-gray-100 flex flex-col items-center justify-center shrink-0">
          <span className="text-xl sm:text-2xl font-black text-gray-800 leading-none">
            {deal.discount}
          </span>
          <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
            % OFF
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1 pt-0.5 sm:pt-0">
          {deal.description}
        </p>
      </div>

      {/* ── counter offer box ── */}
      {deal.status === "counter" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-violet-200 bg-white p-3 relative"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-violet-50 border border-violet-200 flex flex-col items-center justify-center shrink-0">
              <span className="text-sm sm:text-base font-black text-violet-600 leading-none">
                {deal.counterDiscount}
              </span>
              <span className="text-[9px] text-violet-400">% OFF</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] text-violet-500 font-medium mb-0.5">
                Doctor's Counter
              </p>
              <p className="text-xs text-violet-700 leading-relaxed line-clamp-2">
                {deal.counterDescription}
              </p>
            </div>
          </div>
          {/* review button — full width on mobile for easier tap */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onCounter(deal)}
            className="mt-2.5 w-full sm:w-auto flex items-center justify-center gap-1.5 px-3 py-2 sm:py-1.5 rounded-lg bg-violet-500 text-white text-xs font-semibold cursor-pointer"
          >
            <MdEdit size={12} /> Review Counter
          </motion.button>
        </motion.div>
      )}

      <p className="text-[11px] text-gray-400 relative">
        Sent {fmt(deal.createdAt)}
      </p>
    </motion.div>
  );
}

export default function OurDeals() {
  const [activeTab, setActiveTab] = useState("pending");
  const [deals, setDeals] = useState(MOCK_DEALS);
  const [counterDeal, setCounterDeal] = useState(null);

  const counts = Object.fromEntries(
    TABS.map((t) => [t.key, deals.filter((d) => d.status === t.key).length]),
  );

  const filtered = deals.filter((d) => d.status === activeTab);

  const handleCounterClose = (result) => {
    if (result) {
      setDeals((prev) =>
        prev.map((d) =>
          d._id === counterDeal._id
            ? { ...d, status: result === "accepted" ? "pending" : "rejected" }
            : d,
        ),
      );
    }
    setCounterDeal(null);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4 sm:gap-5">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Deals
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              Track your sent lab offers
            </p>
          </div>
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg shadow-blue-200">
            <MdPercent size={18} color="#fff" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 }}
          className="flex gap-1.5 sm:gap-2 p-1 bg-gray-100 rounded-2xl"
        >
          {TABS.map((tab) => {
            const isActive = activeTab === tab.key;
            const styles = TAB_STYLES[tab.color];
            const Icon = tab.icon;
            return (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`relative flex-1 flex items-center justify-center gap-1 sm:gap-1.5 h-8 sm:h-9 px-1.5 sm:px-2 rounded-xl text-[12px] sm:text-[13px] font-semibold transition-colors duration-200 cursor-pointer
                  ${isActive ? styles.active : styles.inactive}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="tab-bg"
                    className={`absolute inset-0 rounded-xl ${styles.active}`}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative flex items-center gap-1 sm:gap-1.5">
                  <Icon size={12} />
                  <span className="hidden xs:inline sm:inline">
                    {tab.label}
                  </span>
                  {counts[tab.key] > 0 && (
                    <span
                      className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold
                      ${isActive ? "bg-white/25 text-white" : styles.badge}`}
                    >
                      {counts[tab.key]}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>

        <div className="flex flex-col gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center gap-3 py-14 text-center"
              >
                <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-gray-100 flex items-center justify-center">
                  {(() => {
                    const Icon = TABS.find((t) => t.key === activeTab)?.icon;
                    return <Icon size={20} className="text-gray-400" />;
                  })()}
                </div>
                <p className="text-sm font-medium text-gray-400">
                  No {activeTab} deals
                </p>
              </motion.div>
            ) : (
              filtered.map((deal, i) => (
                <DealCard
                  key={deal._id}
                  deal={deal}
                  index={i}
                  onCounter={setCounterDeal}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {counterDeal && (
          <CounterModal deal={counterDeal} onClose={handleCounterClose} />
        )}
      </AnimatePresence>
    </>
  );
}
