import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RiCheckLine, RiCloseLine, RiSearchLine } from "react-icons/ri";
import { MdEdit, MdAccessTime } from "react-icons/md";
import { TbCancel } from "react-icons/tb";
import { useGetDoctorOffersByStatus } from "./../../hooks/useGetDoctorOffers";
import { useDealMutations } from "./../../hooks/useDealMutation";
import { useGetDoctorOffersSummary } from "./../../hooks/useGetDoctorOffersSummary";

/* ─── helpers ─── */
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ini = (n = "") =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ─── status enum from API: 0=Pending, 1=Accepted, 2=Rejected ─── */
const STATUS_META = {
  received: {
    label: "Received",
    border: "border-amber-200",
    bg: "bg-amber-50/60",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  counter: {
    label: "Counter Sent",
    border: "border-violet-200",
    bg: "bg-violet-50/60",
    text: "text-violet-700",
    dot: "bg-violet-500",
  },
  rejected: {
    label: "Rejected",
    border: "border-rose-200",
    bg: "bg-rose-50/60",
    text: "text-rose-600",
    dot: "bg-rose-500",
  },
};

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

/* ─── status meta — tab key maps directly from API now ─── */

/* ══════════════════════════════════
   DEAL CARD
══════════════════════════════════ */
function DealCard({
  deal,
  tab,
  index,
  onCounter,
  onAccept,
  onReject,
  onCancelCounter,
  isLoading,
}) {
  const meta = STATUS_META[tab];

  const daysLeft = deal.respondedAtUtc
    ? Math.max(
        0,
        Math.ceil(
          (new Date(deal.respondedAtUtc).getTime() +
            7 * 24 * 60 * 60 * 1000 -
            Date.now()) /
            (1000 * 60 * 60 * 24),
        ),
      )
    : null;

  const isLab = deal.providerType === 0;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{
        delay: index * 0.05,
        duration: 0.28,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      className={`relative rounded-2xl border ${meta.border} ${meta.bg} p-4 flex flex-col gap-3 overflow-hidden`}
    >
      {/* dot pattern */}
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: "radial-gradient(circle, #000 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-2 relative">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-10 h-10 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0
              ${isLab ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-sky-50 border border-sky-200 text-sky-700"}`}
          >
            {ini(deal.providerName)}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-900 leading-tight truncate">
              {deal.providerName || "—"}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {isLab ? "Medical Laboratory" : "Radiology Center"}
            </p>
          </div>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-medium bg-white border ${meta.border} ${meta.text} shrink-0`}
        >
          <span className={`w-1.5 h-1.5 rounded-full ${meta.dot} shrink-0`} />
          <span className="whitespace-nowrap">{meta.label}</span>
        </div>
      </div>

      {/* Discount + offer */}
      <div className="flex items-start sm:items-center gap-3 relative">
        <div className="w-14 h-14 rounded-xl bg-white shadow-sm border border-gray-100 flex flex-col items-center justify-center shrink-0">
          <span className="text-2xl font-black text-gray-800 leading-none">
            {deal.discountPercentage}
          </span>
          <span className="text-[9px] text-gray-400 font-medium">% OFF</span>
        </div>
        <p className="text-sm text-gray-600 leading-relaxed flex-1 pt-0.5">
          {deal.offerContent}
        </p>
      </div>

      {/* Counter offer box */}
      {tab === "counter" && deal.counterOffers?.[0] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-violet-200 bg-white p-3 relative"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-10 h-10 rounded-lg bg-violet-50 border border-violet-200 flex flex-col items-center justify-center shrink-0">
              <span className="text-base font-black text-violet-600 leading-none">
                {deal.counterOffers[0].discountPercentage}
              </span>
              <span className="text-[9px] text-violet-400">% OFF</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[11px] text-violet-500 font-medium mb-0.5">
                Your Counter Offer
              </p>
              <p className="text-xs text-violet-700 leading-relaxed line-clamp-2">
                {deal.counterOffers[0].offerContent}
              </p>
            </div>
          </div>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onCancelCounter(deal.counterOffers[0].id)}
            disabled={isLoading}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition-colors disabled:opacity-50"
          >
            <TbCancel size={13} /> Cancel Counter
          </motion.button>
        </motion.div>
      )}

      <p className="text-[11px] text-gray-400 relative">
        Sent {fmt(deal.requestedAtUtc)}
      </p>

      {/* Actions for received */}
      {tab === "received" && (
        <div className="flex gap-2 relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onAccept(deal.id)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <RiCheckLine /> Accept
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onCounter(deal)}
            disabled={isLoading}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-blue-600 text-white text-[12px] font-semibold hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
          >
            <MdEdit size={13} /> Counter
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onReject(deal.id)}
            disabled={isLoading}
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white text-rose-500 text-[12px] font-semibold hover:bg-rose-50 transition-colors disabled:opacity-50"
          >
            <RiCloseLine />
          </motion.button>
        </div>
      )}

      {/* Auto-delete note for rejected */}
      {tab === "rejected" && daysLeft !== null && (
        <div className="flex items-center gap-1.5 px-2.5 py-2 rounded-xl bg-rose-100/60 border border-rose-200 relative">
          <MdAccessTime size={13} className="text-rose-400 shrink-0" />
          <p className="text-[11px] text-rose-600 leading-tight">
            {daysLeft === 0
              ? "Will be deleted today"
              : daysLeft === 1
                ? "Will be deleted tomorrow"
                : `Auto-deleted in ${daysLeft} day${daysLeft !== 1 ? "s" : ""}`}{" "}
            · Rejected offers are removed after 7 days
          </p>
        </div>
      )}
    </motion.div>
  );
}

/* ══════════════════════════════════
   COUNTER MODAL
══════════════════════════════════ */
function CounterModal({ deal, onClose, onSubmit, isLoading }) {
  const [disc, setDisc] = useState(deal.discountPercentage + 5);
  const [note, setNote] = useState("");

  const handleSubmit = () => {
    onSubmit({ id: deal.id, data: { newDiscountPercentage: Number(disc) } });
    onClose();
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 20 }}
        animate={{
          opacity: 1,
          scale: 1,
          y: 0,
          transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] },
        }}
        exit={{ opacity: 0, scale: 0.95 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl w-full max-w-md border border-slate-200 shadow-2xl overflow-hidden"
      >
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
          <div>
            <p className="text-[15px] font-bold text-slate-900">
              Send Counter Offer
            </p>
            <p className="text-[12px] text-slate-400 mt-0.5">
              Responding to {deal.providerName}
            </p>
          </div>
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"
          >
            <RiCloseLine />
          </motion.button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Their offer */}
          <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
              Their offer
            </p>
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center flex-shrink-0">
                <span className="text-lg font-extrabold text-slate-800 leading-none">
                  {deal.discountPercentage}
                </span>
                <span className="text-[8px] text-slate-400">% OFF</span>
              </div>
              <p className="text-[12.5px] text-slate-500 leading-relaxed">
                {deal.offerContent}
              </p>
            </div>
          </div>

          <div>
            <label className="text-[12px] text-slate-500 font-medium block mb-1.5">
              Your counter discount (%)
            </label>
            <input
              value={disc}
              onChange={(e) => setDisc(e.target.value)}
              type="number"
              min="1"
              max="100"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-base font-bold text-slate-900"
            />
          </div>

          <div>
            <label className="text-[12px] text-slate-500 font-medium block mb-1.5">
              Counter offer details (optional)
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Describe your counter offer…"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-[13px] text-slate-700 resize-none leading-relaxed"
            />
          </div>
        </div>

        <div className="px-5 pb-5 flex gap-2.5">
          <button
            onClick={onClose}
            className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-[13px] font-semibold hover:bg-slate-50"
          >
            Cancel
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-[2] py-3 rounded-xl bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md disabled:opacity-50"
          >
            <RiCheckLine /> Send Counter
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ══════════════════════════════════
   DEALS PAGE
══════════════════════════════════ */
export default function DealsPage() {
  const [filter, setFilter] = useState("received");
  const [counterDeal, setCounterDeal] = useState(null);
  const [search, setSearch] = useState("");

  const { data, isLoading, isError } = useGetDoctorOffersByStatus(filter);
  const { data: summary } = useGetDoctorOffersSummary();
  const {
    acceptMutation,
    rejectMutation,
    counterMutation,
    cancelCounterMutation,
  } = useDealMutations();

  const items = data?.items ?? [];

  const counts = {
    received: summary?.receivedCount ?? 0,
    counter: summary?.counterCount ?? 0,
    rejected: summary?.rejectedCount ?? 0,
  };

  const filtered = useMemo(
    () =>
      items.filter(
        (d) =>
          !search ||
          d.providerName?.toLowerCase().includes(search.toLowerCase()),
      ),
    [items, search],
  );

  const TABS = [
    {
      key: "received",
      label: "Received",
      activeBg: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      key: "counter",
      label: "Counter Sent",
      activeBg: "bg-violet-50 border-violet-200 text-violet-800",
    },
    {
      key: "rejected",
      label: "Rejected",
      activeBg: "bg-rose-50 border-rose-200 text-rose-700",
    },
  ];

  const isMutating =
    acceptMutation.isPending ||
    rejectMutation.isPending ||
    counterMutation.isPending ||
    cancelCounterMutation.isPending;

  if (isLoading)
    return (
      <div className="flex items-center justify-center py-24 text-slate-400 text-sm">
        Loading deals…
      </div>
    );

  if (isError)
    return (
      <div className="flex items-center justify-center py-24 text-rose-400 text-sm">
        Failed to load deals. Please try again.
      </div>
    );

  return (
    <>
      {/* Filters row */}
      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex gap-2 flex-wrap">
          {TABS.map((t) => (
            <motion.button
              key={t.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => setFilter(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border transition-all
                ${filter === t.key ? t.activeBg + " shadow-sm" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"}`}
            >
              {t.label}
              <span
                className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md ${filter === t.key ? "bg-white/70" : "bg-slate-100 text-slate-400"}`}
              >
                {counts[t.key]}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Cards grid */}
      <motion.div
        key={filter}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
      >
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              variants={fadeUp}
              className="col-span-full text-center py-20 text-slate-400 text-sm"
            >
              No {filter} deals right now
            </motion.p>
          ) : (
            filtered.map((deal, index) => (
              <DealCard
                key={deal.id}
                deal={deal}
                tab={filter}
                index={index}
                isLoading={isMutating}
                onAccept={(id) => acceptMutation.mutate(id)}
                onReject={(id) => rejectMutation.mutate(id)}
                onCounter={(d) => setCounterDeal(d)}
                onCancelCounter={(id) => cancelCounterMutation.mutate(id)}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Counter Modal */}
      <AnimatePresence>
        {counterDeal && (
          <CounterModal
            deal={counterDeal}
            onClose={() => setCounterDeal(null)}
            onSubmit={({ id, data }) => counterMutation.mutate({ id, data })}
            isLoading={counterMutation.isPending}
          />
        )}
      </AnimatePresence>
    </>
  );
}
