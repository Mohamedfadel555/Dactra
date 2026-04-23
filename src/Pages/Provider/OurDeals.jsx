import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaRegClock } from "react-icons/fa6";
import { PiArrowsCounterClockwise } from "react-icons/pi";
import { TbCancel } from "react-icons/tb";
import {
  MdPercent,
  MdEdit,
  MdClose,
  MdCheck,
  MdInfo,
  MdBlock,
  MdAccessTime,
} from "react-icons/md";
import { useOffersSummary } from "../../hooks/useOffersSummary";
import { useOffersByStat } from "../../hooks/useOffersByStat";
import AvatarIcon from "../../Components/Common/AvatarIcon1";
import { useProviderAcceptCounter } from "../../hooks/useProviderAcceptCounter";
import { useProviderRejectCounter } from "../../hooks/useProviderRejectCounter";
import { useProviderCancelOffer } from "../../hooks/useProviderCancelOffer";

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

  const acceptMutation = useProviderAcceptCounter();
  const rejectMutation = useProviderRejectCounter();

  const newDeal = deal.counterOffers[0];

  const act = async (type) => {
    setLoading(type);
    type === "accepted"
      ? await acceptMutation.mutateAsync(newDeal.id)
      : await rejectMutation.mutateAsync(newDeal.id);
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
                ? `You've accepted the counter offer of ${newDeal.discountPercentage}% discount from ${newDeal.doctorName}.`
                : `You've rejected the counter offer from ${newDeal.doctorName}.`}
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <AvatarIcon />
                <div className="min-w-0">
                  <p className="text-sm sm:text-[15px] font-semibold text-gray-900 leading-tight truncate">
                    Counter Offer
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {newDeal.doctorName} · {newDeal.doctorSpeciality}
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

            <div className="px-4 sm:px-5 py-4 flex flex-col gap-3 overflow-y-auto flex-1">
              <div className="rounded-xl border border-gray-200 bg-gray-50 p-3 sm:p-4">
                <p className="text-[10px] sm:text-[11px] text-gray-400 uppercase tracking-wider mb-2">
                  Your Original Offer
                </p>
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-gray-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl font-bold text-gray-500 leading-none">
                      {deal.discountPercentage}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-gray-400">
                      % OFF
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed line-through flex-1">
                    {deal.offerContent}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-violet-200 bg-violet-50 p-3 sm:p-4">
                <p className="text-[10px] sm:text-[11px] text-violet-500 uppercase tracking-wider mb-2">
                  Doctor's Counter
                </p>
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-violet-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl font-bold text-violet-600 leading-none">
                      {newDeal.discountPercentage}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-violet-400">
                      % OFF
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-violet-700 leading-relaxed flex-1">
                    {newDeal.offerContent}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 items-start bg-sky-50 border border-sky-200 rounded-xl px-3 sm:px-3.5 py-2.5">
                <MdInfo size={14} className="text-sky-500 shrink-0 mt-0.5" />
                <p className="text-xs text-sky-700 leading-relaxed">
                  Accepting will activate the deal at the doctor's proposed
                  discount rate.
                </p>
              </div>
            </div>

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
function DealCard({ deal, index, onCounter, onCancel }) {
  const statusKey =
    deal.status === 0 ? "pending" : deal.status === 1 ? "rejected" : "counter";
  const meta = STATUS_META[statusKey];

  // حساب تاريخ الحذف التلقائي (أسبوع من تاريخ الرفض)
  const deletionDate =
    deal.status === 1 && deal.requestedAtUtc
      ? new Date(
          new Date(deal.requestedAtUtc).getTime() + 7 * 24 * 60 * 60 * 1000,
        )
      : null;

  const daysLeft = deletionDate
    ? Math.max(
        0,
        Math.ceil((deletionDate - new Date()) / (1000 * 60 * 60 * 24)),
      )
    : null;

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
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      <div className="flex items-start justify-between gap-2 relative">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-white shadow-sm border border-gray-100 flex items-center justify-center text-xs sm:text-sm font-bold text-gray-600 shrink-0">
            <AvatarIcon />
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
              {deal.doctorName}
            </p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">
              {deal.doctorSpeciality}
            </p>
          </div>
        </div>

        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-medium bg-white border ${meta.border} ${meta.text} shrink-0`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} shrink-0`} />
          <span className="whitespace-nowrap">{meta.label}</span>
        </div>
      </div>

      <div className="flex items-start sm:items-center gap-3 relative">
        <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-white shadow-sm border border-gray-100 flex flex-col items-center justify-center shrink-0">
          <span className="text-xl sm:text-2xl font-black text-gray-800 leading-none">
            {deal.discountPercentage}
          </span>
          <span className="text-[9px] sm:text-[10px] text-gray-400 font-medium">
            % OFF
          </span>
        </div>
        <p className="text-xs sm:text-sm text-gray-600 leading-relaxed flex-1 pt-0.5 sm:pt-0">
          {deal.offerContent}
        </p>
      </div>

      {deal.status === 2 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-violet-200 bg-white p-3 relative"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-violet-50 border border-violet-200 flex flex-col items-center justify-center shrink-0">
              <span className="text-sm sm:text-base font-black text-violet-600 leading-none">
                {deal.counterOffers?.[0]?.discountPercentage ?? "—"}
              </span>
              <span className="text-[9px] text-violet-400">% OFF</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] text-violet-500 font-medium mb-0.5">
                Doctor's Counter
              </p>
              <p className="text-xs text-violet-700 leading-relaxed line-clamp-2">
                {deal.counterOffers?.[0]?.offerContent}
              </p>
            </div>
          </div>
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
        Sent {fmt(deal.requestedAtUtc)}
      </p>

      {/* زرار كانسل للـ pending */}
      {deal.status === 0 && (
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onCancel(deal)}
          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer relative"
        >
          <TbCancel size={13} /> Cancel Offer
        </motion.button>
      )}

      {/* نوت الحذف التلقائي للـ rejected */}
      {deal.status === 1 && daysLeft !== null && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-rose-100/60 border border-rose-200 relative"
        >
          <MdAccessTime size={13} className="text-rose-400 shrink-0" />
          <p className="text-[11px] text-rose-600 leading-tight">
            {daysLeft === 0
              ? "Will be deleted today"
              : daysLeft === 1
                ? "Will be deleted tomorrow"
                : `Auto-deleted in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}{" "}
            · Rejected offers are removed after 7 days
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── LoadMore Button ──────────────────────────────────────────────────────────
function LoadMoreButton({ onClick, loading }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      className="w-full py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {loading ? (
        <Spinner cls="border-gray-200 border-t-gray-500" />
      ) : (
        "Load more"
      )}
    </motion.button>
  );
}

function CancelPendingModal({ deal, onClose }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const cancelMutation = useProviderCancelOffer();

  const handleCancel = async () => {
    setLoading(true);
    await cancelMutation.mutateAsync(deal.id);
    setLoading(false);
    setDone(true);
    setTimeout(() => onClose("cancelled"), 1600);
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
        className="w-full sm:max-w-[420px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col"
      >
        {done ? (
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
                className="absolute inset-0 rounded-full bg-rose-400/15"
                animate={{ scale: [1, 2.1], opacity: [0.5, 0] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-rose-400 to-rose-600 flex items-center justify-center">
                <TbCancel size={26} color="#fff" />
              </div>
            </motion.div>
            <p className="text-lg font-bold text-gray-900">Offer Cancelled</p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              Your offer to {deal.doctorName} has been cancelled successfully.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                <AvatarIcon />
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
                    Cancel Offer
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5 truncate">
                    {deal.doctorName} · {deal.doctorSpeciality}
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

            {/* body */}
            <div className="px-4 sm:px-5 py-4 flex flex-col gap-3 overflow-y-auto flex-1">
              {/* offer summary */}
              <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 sm:p-4">
                <p className="text-[10px] sm:text-[11px] text-amber-500 uppercase tracking-wider mb-2">
                  Pending Offer
                </p>
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-white border border-amber-200 flex flex-col items-center justify-center shrink-0">
                    <span className="text-lg sm:text-xl font-bold text-amber-600 leading-none">
                      {deal.discountPercentage}
                    </span>
                    <span className="text-[9px] sm:text-[10px] text-amber-400">
                      % OFF
                    </span>
                  </div>
                  <p className="text-xs sm:text-sm text-amber-800 leading-relaxed flex-1">
                    {deal.offerContent}
                  </p>
                </div>
              </div>

              {/* warning */}
              <div className="flex gap-2.5 items-start rounded-xl px-3.5 py-3 bg-rose-50 border border-rose-200">
                <MdBlock size={15} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-800 leading-relaxed">
                  This will permanently cancel the offer sent to{" "}
                  <strong>{deal.doctorName}</strong>. The doctor will no longer
                  be able to respond to it.
                </p>
              </div>
            </div>

            {/* footer */}
            <div className="flex gap-2 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={() => onClose(null)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Keep Pending
              </button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={handleCancel}
                className="flex-[2] py-2.5 text-sm font-semibold rounded-xl text-white flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                style={{
                  background: "linear-gradient(135deg,#e11d48,#be123c)",
                }}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <TbCancel size={15} /> Cancel Offer
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

export default function OurDeals() {
  const [activeTab, setActiveTab] = useState("pending");
  const [counterDeal, setCounterDeal] = useState(null);
  const [cancelDeal, setCancelDeal] = useState(null);

  const { data: summary } = useOffersSummary();

  const {
    data: dealsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useOffersByStat(
    activeTab === "pending" ? 0 : activeTab === "rejected" ? 1 : 2,
  );

  const allDeals = dealsData?.pages.flatMap((page) => page.items) ?? [];
  console.log(allDeals);

  const counts = {
    pending: summary?.pendingCount ?? 0,
    counter: summary?.counterCount ?? 0,
    rejected: summary?.rejectedCount ?? 0,
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

        {/* Tabs */}
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

        {/* Cards */}
        <div className="flex flex-col gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {allDeals.length === 0 ? (
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
              allDeals.map((deal, i) => (
                <DealCard
                  key={deal.id}
                  deal={deal}
                  index={i}
                  onCounter={setCounterDeal}
                  onCancel={setCancelDeal}
                />
              ))
            )}
          </AnimatePresence>

          {hasNextPage && (
            <LoadMoreButton
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {counterDeal && (
          <CounterModal
            deal={counterDeal}
            onClose={() => setCounterDeal(null)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cancelDeal && (
          <CancelPendingModal
            deal={cancelDeal}
            onClose={() => setCancelDeal(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
