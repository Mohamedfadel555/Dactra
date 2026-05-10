import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  useQuery,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import {
  RiFileListLine,
  RiStarLine,
  RiGroupLine,
  RiSearchLine,
  RiCloseLine,
  RiCheckLine,
  RiTimeLine,
  RiMapPinLine,
  RiFlaskLine,
  RiScanLine,
  RiBellLine,
  RiArrowRightSLine,
  RiEditLine,
} from "react-icons/ri";
import { MdEdit, MdAccessTime } from "react-icons/md";
import { TbCancel } from "react-icons/tb";
import Navbar from "../Components/Common/Navbar";

/* ─── data ─── */
const DEALS_DATA = [
  // Received deals (status: "received")
  {
    id: 1,
    status: "received",
    labName: "Alpha Lab",
    labType: "lab",
    disc: 30,
    offer:
      "Full CBC + lipid profile with priority processing for referred patients",
    sent: "2026-04-28",
    co: null,
    doctorName: "Alpha Lab",
    doctorSpeciality: "Medical Laboratory",
    discountPercentage: 30,
    offerContent:
      "Full CBC + lipid profile with priority processing for referred patients",
    requestedAtUtc: "2026-04-28",
    counterOffers: null,
  },
  {
    id: 2,
    status: "received",
    labName: "Nile Diagnostics",
    labType: "lab",
    disc: 20,
    offer: "HbA1c + thyroid panel bundle for diabetic care patients",
    sent: "2026-04-29",
    co: null,
    doctorName: "Nile Diagnostics",
    doctorSpeciality: "Medical Laboratory",
    discountPercentage: 20,
    offerContent: "HbA1c + thyroid panel bundle for diabetic care patients",
    requestedAtUtc: "2026-04-29",
    counterOffers: null,
  },
  // Counter deals (status: "counter") - doctor sent counter offer
  {
    id: 3,
    status: "counter",
    labName: "Scan & Ray Center",
    labType: "xray",
    disc: 15,
    offer: "CT chest + abdomen package",
    sent: "2026-04-27",
    co: {
      disc: 25,
      offer: "CT chest + abdomen + pelvis full package for oncology referrals",
    },
    doctorName: "Scan & Ray Center",
    doctorSpeciality: "Radiology Center",
    discountPercentage: 15,
    offerContent: "CT chest + abdomen package",
    requestedAtUtc: "2026-04-27",
    counterOffers: [
      {
        discountPercentage: 25,
        offerContent:
          "CT chest + abdomen + pelvis full package for oncology referrals",
      },
    ],
  },
  // Rejected deals (status: "rejected")
  {
    id: 4,
    status: "rejected",
    labName: "Cairo Labs",
    labType: "lab",
    disc: 10,
    offer: "Basic metabolic panel for hypertension monitoring",
    sent: "2026-04-20",
    co: null,
    doctorName: "Cairo Labs",
    doctorSpeciality: "Medical Laboratory",
    discountPercentage: 10,
    offerContent: "Basic metabolic panel for hypertension monitoring",
    requestedAtUtc: "2026-04-20",
    counterOffers: null,
  },
];

const PATIENTS_DATA = [
  {
    id: 1,
    name: "Sara Mohamed",
    visit: "2026-05-01",
    initials: "SM",
    color: "#3B82F6",
    type: "sponsored",
  },
  {
    id: 2,
    name: "Karim Ali",
    visit: "2026-04-30",
    initials: "KA",
    color: "#10B981",
    type: "sponsored",
  },
  {
    id: 3,
    name: "Nour Hassan",
    visit: "2026-04-29",
    initials: "NH",
    color: "#F59E0B",
    type: "regular",
  },
  {
    id: 4,
    name: "Mohamed Farouk",
    visit: "2026-04-28",
    initials: "MF",
    color: "#EF4444",
    type: "sponsored",
  },
  {
    id: 5,
    name: "Rania Adel",
    visit: "2026-04-27",
    initials: "RA",
    color: "#8B5CF6",
    type: "regular",
  },
  {
    id: 6,
    name: "Ahmed Samir",
    visit: "2026-04-25",
    initials: "AS",
    color: "#06B6D4",
    type: "sponsored",
  },
  {
    id: 7,
    name: "Dina Khalil",
    visit: "2026-04-22",
    initials: "DK",
    color: "#F97316",
    type: "regular",
  },
];

const SPONSORS_DATA = [
  {
    name: "Alpha Lab",
    loc: "Maadi, Cairo",
    type: "lab",
    disc: "30%",
    referred: 47,
    since: "Jan 2026",
  },
  {
    name: "Scan & Ray Center",
    loc: "Heliopolis, Cairo",
    type: "xray",
    disc: "20%",
    referred: 31,
    since: "Feb 2026",
  },
];

/* ─── helpers ─── */
const fmt = (d) =>
  new Date(d).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });

const ini = (n) =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

/* ─── animation ─── */
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
};
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.06 } } };

/* ─── STATUS META ─── */
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

/* ══════════════════════════════════════════
   DEAL CARD (new design)
══════════════════════════════════════════ */
function DealCard({ deal, index, onCounter, onCancel, onAccept, onReject }) {
  const meta = STATUS_META[deal.status];

  const deletionDate =
    deal.status === "rejected" && deal.requestedAtUtc
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

  const isLab = deal.labType === "lab";

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

      {/* Top: lab name + status pill */}
      <div className="flex items-start justify-between gap-2 relative">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div
            className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-[11px] font-bold flex-shrink-0
              ${isLab ? "bg-emerald-50 border border-emerald-200 text-emerald-800" : "bg-sky-50 border border-sky-200 text-sky-700"}`}
          >
            {ini(deal.doctorName)}
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

      {/* Discount + offer */}
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

      {/* Counter offer box — for counter status */}
      {deal.status === "counter" && deal.counterOffers?.[0] && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          className="rounded-xl border border-violet-200 bg-white p-3 relative"
        >
          <div className="flex items-start sm:items-center gap-2.5">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-violet-50 border border-violet-200 flex flex-col items-center justify-center shrink-0">
              <span className="text-sm sm:text-base font-black text-violet-600 leading-none">
                {deal.counterOffers[0].discountPercentage}
              </span>
              <span className="text-[9px] text-violet-400">% OFF</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[10px] sm:text-[11px] text-violet-500 font-medium mb-0.5">
                Your Counter Offer
              </p>
              <p className="text-xs text-violet-700 leading-relaxed line-clamp-2">
                {deal.counterOffers[0].offerContent}
              </p>
            </div>
          </div>
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onCancel && onCancel(deal)}
            className="mt-2.5 w-full flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg bg-rose-50 border border-rose-200 text-rose-600 text-xs font-semibold cursor-pointer hover:bg-rose-100 transition-colors"
          >
            <TbCancel size={13} /> Cancel Counter
          </motion.button>
        </motion.div>
      )}

      <p className="text-[11px] text-gray-400 relative">
        Sent {fmt(deal.requestedAtUtc)}
      </p>

      {/* Actions for received deals */}
      {deal.status === "received" && (
        <div className="flex gap-2 relative">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onAccept && onAccept(deal)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-emerald-200 bg-emerald-600 text-white text-[12px] font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
          >
            <RiCheckLine /> Accept
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onCounter && onCounter(deal)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl border border-blue-200 bg-blue-600 text-white text-[12px] font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <MdEdit size={13} /> Counter
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={() => onReject && onReject(deal)}
            className="flex items-center gap-1 px-3.5 py-2.5 rounded-xl border border-rose-200 bg-white text-rose-500 text-[12px] font-semibold hover:bg-rose-50 transition-colors"
          >
            <RiCloseLine />
          </motion.button>
        </div>
      )}

      {/* Auto-delete note for rejected */}
      {deal.status === "rejected" && daysLeft !== null && (
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

/* ══════════════════════════════════════════
   DEALS PAGE
══════════════════════════════════════════ */
function DealsPage() {
  const { data: deals = [] } = useQuery({
    queryKey: ["deals"],
    queryFn: () => Promise.resolve(DEALS_DATA),
    staleTime: Infinity,
  });

  const [filter, setFilter] = useState("received");
  const [counterDeal, setCounterDeal] = useState(null);

  const counts = {
    received: deals.filter((d) => d.status === "received").length,
    counter: deals.filter((d) => d.status === "counter").length,
    rejected: deals.filter((d) => d.status === "rejected").length,
  };

  const filtered = useMemo(
    () => deals.filter((d) => d.status === filter),
    [deals, filter],
  );

  const TABS = [
    {
      key: "received",
      label: "Received",
      activeBg: "bg-amber-50 border-amber-200 text-amber-800",
    },
    {
      key: "counter",
      label: "Counter Deals",
      activeBg: "bg-violet-50 border-violet-200 text-violet-800",
    },
    {
      key: "rejected",
      label: "Rejected",
      activeBg: "bg-rose-50 border-rose-200 text-rose-700",
    },
  ];

  return (
    <>
      {/* Tab strip */}
      <div className="flex gap-2 mb-5 flex-wrap">
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
              className={`text-[11px] font-bold px-1.5 py-0.5 rounded-md
                ${filter === t.key ? "bg-white/70" : "bg-slate-100 text-slate-400"}`}
            >
              {counts[t.key]}
            </span>
          </motion.button>
        ))}
      </div>

      {/* Cards */}
      <motion.div
        key={filter}
        variants={stagger}
        initial="hidden"
        animate="show"
        className="flex flex-col gap-4"
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
                index={index}
                onCounter={(d) => setCounterDeal(d)}
                onCancel={(d) => console.log("Cancel counter for", d.id)}
                onAccept={(d) => console.log("Accept", d.id)}
                onReject={(d) => console.log("Reject", d.id)}
              />
            ))
          )}
        </AnimatePresence>
      </motion.div>

      {/* Counter Modal */}
      <AnimatePresence>
        {counterDeal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setCounterDeal(null)}
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
                    Responding to {counterDeal.labName}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setCounterDeal(null)}
                  className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 hover:bg-slate-200"
                >
                  <RiCloseLine />
                </motion.button>
              </div>
              <div className="p-5 flex flex-col gap-4">
                <div className="bg-slate-50 rounded-xl border border-slate-100 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-3">
                    Their offer
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex flex-col items-center justify-center flex-shrink-0">
                      <span className="text-lg font-extrabold text-slate-800 leading-none">
                        {counterDeal.disc}
                      </span>
                      <span className="text-[8px] text-slate-400">% OFF</span>
                    </div>
                    <p className="text-[12.5px] text-slate-500 leading-relaxed">
                      {counterDeal.offer}
                    </p>
                  </div>
                </div>
                <div>
                  <label className="text-[12px] text-slate-500 font-medium block mb-1.5">
                    Your counter discount (%)
                  </label>
                  <input
                    defaultValue="35"
                    type="number"
                    min="1"
                    max="100"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-base font-bold text-slate-900"
                  />
                </div>
                <div>
                  <label className="text-[12px] text-slate-500 font-medium block mb-1.5">
                    Counter offer details
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Describe your counter offer…"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-[13px] text-slate-700 resize-none leading-relaxed"
                  />
                </div>
              </div>
              <div className="px-5 pb-5 flex gap-2.5">
                <button
                  onClick={() => setCounterDeal(null)}
                  className="flex-1 py-3 rounded-xl border border-slate-200 text-slate-500 text-[13px] font-semibold hover:bg-slate-50"
                >
                  Cancel
                </button>
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setCounterDeal(null)}
                  className="flex-[2] py-3 rounded-xl bg-blue-600 text-white text-[13px] font-bold flex items-center justify-center gap-2 hover:bg-blue-700 shadow-md"
                >
                  <RiCheckLine /> Send Counter
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ══════════════════════════════════════════
   SPONSORS
══════════════════════════════════════════ */
function SponsorsPage() {
  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        {[
          { l: "Active Sponsors", v: "2", c: "text-blue-600" },
          { l: "Patients Benefited", v: "78", c: "text-emerald-600" },
          { l: "Avg Discount", v: "25%", c: "text-violet-600" },
        ].map(({ l, v, c }) => (
          <div
            key={l}
            className="bg-white rounded-2xl border border-slate-200 px-5 py-4"
          >
            <p className="text-[11.5px] text-slate-400 mb-1">{l}</p>
            <p className={`text-[28px] font-extrabold leading-none ${c}`}>
              {v}
            </p>
          </div>
        ))}
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {SPONSORS_DATA.map((sp) => (
          <motion.div
            key={sp.name}
            variants={fadeUp}
            className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col gap-5 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center gap-4">
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0
                  ${sp.type === "lab" ? "bg-emerald-50 border border-emerald-200" : "bg-sky-50 border border-sky-200"}`}
              >
                {sp.type === "lab" ? (
                  <RiFlaskLine className="text-emerald-600" />
                ) : (
                  <RiScanLine className="text-sky-600" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-[15px] font-bold text-slate-900">
                  {sp.name}
                </p>
                <p className="flex items-center gap-1 text-[12px] text-slate-400 mt-0.5">
                  <RiMapPinLine className="text-xs" /> {sp.loc}
                </p>
                <span
                  className={`inline-block mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold
                    ${sp.type === "lab" ? "bg-emerald-50 text-emerald-700" : "bg-sky-50 text-sky-700"}`}
                >
                  {sp.type === "lab" ? "Laboratory" : "Radiology"}
                </span>
              </div>
              <div className="text-right">
                <p className="text-[28px] font-extrabold text-blue-600 leading-none">
                  {sp.disc}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  off for patients
                </p>
              </div>
            </div>
            <div className="h-px bg-slate-100" />
            <div className="grid grid-cols-2 gap-4">
              {[
                { k: "Patients referred", v: sp.referred },
                { k: "Active since", v: sp.since },
                { k: "Status", v: "Active", isGreen: true },
              ].map(({ k, v, isGreen }) => (
                <div key={k}>
                  <p className="text-[11px] text-slate-400 mb-0.5">{k}</p>
                  <p
                    className={`text-[14px] font-bold ${isGreen ? "text-emerald-600" : "text-slate-700"}`}
                  >
                    {isGreen ? "● " : ""}
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

/* ══════════════════════════════════════════
   PATIENTS
══════════════════════════════════════════ */
function PatientsPage() {
  const { data: patients = [] } = useQuery({
    queryKey: ["patients"],
    queryFn: () => Promise.resolve(PATIENTS_DATA),
    staleTime: Infinity,
  });
  const [ptFilter, setPtFilter] = useState("all");
  const [query, setQuery] = useState("");

  const counts = {
    all: patients.length,
    sponsored: patients.filter((p) => p.type === "sponsored").length,
    regular: patients.filter((p) => p.type === "regular").length,
  };

  const filtered = useMemo(
    () =>
      patients.filter((p) => {
        const mf = ptFilter === "all" || p.type === ptFilter;
        const mq = !query || p.name.toLowerCase().includes(query.toLowerCase());
        return mf && mq;
      }),
    [patients, ptFilter, query],
  );

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      <motion.div variants={fadeUp} className="grid grid-cols-3 gap-4">
        {[
          { l: "Under care", v: "78", bg: "bg-blue-600" },
          { l: "This month", v: "12", bg: "bg-amber-500" },
          { l: "Sent to sponsors", v: "47", bg: "bg-emerald-600" },
        ].map(({ l, v, bg }) => (
          <div key={l} className={`${bg} rounded-2xl px-5 py-4 text-white`}>
            <p className="text-[12px] font-medium opacity-70 mb-1">{l}</p>
            <p className="text-[30px] font-extrabold leading-none">{v}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="flex items-center gap-3 flex-wrap"
      >
        <div className="flex gap-2 flex-wrap">
          {[
            { key: "all", label: "All" },
            { key: "sponsored", label: "Sent to sponsor" },
            { key: "regular", label: "Regular" },
          ].map((t) => (
            <motion.button
              key={t.key}
              whileTap={{ scale: 0.97 }}
              onClick={() => setPtFilter(t.key)}
              className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[12.5px] font-semibold border transition-all
                ${ptFilter === t.key ? "bg-blue-600 text-white border-blue-600 shadow-sm" : "bg-white border-slate-200 text-slate-400 hover:text-slate-600"}`}
            >
              {t.label}
              <span
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md
                  ${ptFilter === t.key ? "bg-white/20" : "bg-slate-100 text-slate-400"}`}
              >
                {counts[t.key]}
              </span>
            </motion.button>
          ))}
        </div>
        <div className="relative flex-1 min-w-[160px]">
          <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search patient…"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:border-blue-400 outline-none text-[13px] text-slate-900 bg-white"
          />
        </div>
      </motion.div>

      <motion.div
        variants={fadeUp}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden"
      >
        <div className="grid grid-cols-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
          {["Patient", "Last visit", "Status"].map((h) => (
            <span
              key={h}
              className="text-[11px] font-semibold uppercase tracking-wider text-slate-400"
            >
              {h}
            </span>
          ))}
        </div>
        <AnimatePresence mode="popLayout">
          {filtered.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-slate-400 text-sm"
            >
              No patients found
            </motion.p>
          ) : (
            filtered.map((p, i) => (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0, transition: { delay: i * 0.04 } }}
                exit={{ opacity: 0 }}
                className="grid grid-cols-3 px-5 py-3.5 border-b border-slate-50 last:border-0 items-center hover:bg-slate-50/70 transition-colors cursor-default"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                    style={{ background: p.color + "22", color: p.color }}
                  >
                    {p.initials}
                  </div>
                  <span className="text-[13px] text-slate-800 font-medium">
                    {p.name}
                  </span>
                </div>
                <span className="text-[12.5px] text-slate-400">
                  {fmt(p.visit)}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold w-fit
                    ${p.type === "sponsored" ? "bg-blue-50 border border-blue-200 text-blue-700" : "bg-emerald-50 border border-emerald-200 text-emerald-700"}`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${p.type === "sponsored" ? "bg-blue-500" : "bg-emerald-500"}`}
                  />
                  {p.type === "sponsored" ? "Sponsored" : "Regular"}
                </span>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}

const qc = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={qc}>
      <DoctorPage />
    </QueryClientProvider>
  );
}

function DoctorPage() {
  const [page, setPage] = useState("deals");

  const NAV = [
    { key: "deals", label: "Deals", icon: <RiFileListLine />, badge: 2 },
    { key: "sponsors", label: "Sponsors", icon: <RiStarLine /> },
    { key: "patients", label: "Patients", icon: <RiGroupLine /> },
  ];

  const TITLES = {
    deals: { t: "Deals", s: "Offers from labs & imaging centers" },
    sponsors: { t: "Sponsors", s: "Active labs sponsoring your practice" },
    patients: { t: "Patients", s: "Patients under your care" },
  };

  const PAGE = {
    deals: <DealsPage />,
    sponsors: <SponsorsPage />,
    patients: <PatientsPage />,
  };

  return (
    <div className="bg-white">
      <Navbar />
      <div
        className="flex h-screen w-screen pt-[60px]  overflow-hidden"
        style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
      >
        <style>{`@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');`}</style>

        {/* ── SIDEBAR ── */}
        <aside className="w-60 bg-[#06172E] flex flex-col flex-shrink-0 relative overflow-hidden">
          <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-white/[0.02] pointer-events-none" />
          <div className="absolute top-40 -right-8 w-32 h-32 rounded-full bg-blue-600/10 pointer-events-none" />

          {/* Logo / Brand */}

          {/* Nav */}
          <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
            {NAV.map(({ key, label, icon, badge }) => {
              const active = page === key;
              return (
                <motion.button
                  key={key}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setPage(key)}
                  className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl text-left text-[13px] font-medium transition-all relative group
                  ${active ? "bg-blue-600 text-white font-semibold shadow-md" : "text-white/40 hover:bg-white/[0.05] hover:text-white/70"}`}
                >
                  <span
                    className={`text-base ${active ? "text-white" : "text-white/40 group-hover:text-white/70"}`}
                  >
                    {icon}
                  </span>
                  {label}
                  {badge && (
                    <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-lg shadow">
                      {badge}
                    </span>
                  )}
                  {active && (
                    <RiArrowRightSLine className="ml-auto text-white/60 text-base" />
                  )}
                </motion.button>
              );
            })}
          </nav>
        </aside>

        {/* ── MAIN ── */}
        <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
          {/* Topbar */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="px-8 pt-7"
          >
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#003465]">
              My Appointments
            </h1>
            <p className="text-sm mt-1 font-medium text-[#003465] opacity-70">
              {true
                ? "Manage your patient schedule"
                : "Track your health journey"}
            </p>
          </motion.div>
          {/* </div> */}

          {/* Content */}
          <main className="flex-1 overflow-y-auto px-8 py-7 bg-slate-50">
            <AnimatePresence mode="wait">
              <motion.div
                key={page}
                initial={{ opacity: 0, y: 10 }}
                animate={{
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.2, ease: "easeOut" },
                }}
                exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
              >
                {PAGE[page]}
              </motion.div>
            </AnimatePresence>
          </main>
        </div>
      </div>
    </div>
  );
}
