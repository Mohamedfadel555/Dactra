import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MdSearch,
  MdClose,
  MdCheck,
  MdScience,
  MdPhone,
  MdCalendarToday,
  MdInfo,
  MdCheckCircle,
  MdPerson,
  MdEmail,
} from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { PiFlask } from "react-icons/pi";
import AvatarIcon from "../../Components/Common/AvatarIcon1";
import {
  useReferredPatients,
  useReceiveReferral,
} from "../../hooks/useReferredPatients";

const BLUE = "#316BE8";

// ─── Helpers ──────────────────────────────────────────────────────────────────
const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

// status: 0 = pending, 1 = received
const TABS = [
  { key: 0, label: "Pending" },
  { key: 1, label: "Received" },
];

// ─── Spinner ──────────────────────────────────────────────────────────────────
function Spinner({ color = "white" }) {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      className="w-4 h-4 border-2 rounded-full inline-block shrink-0"
      style={{
        borderColor: `${color}30`,
        borderTopColor: color,
      }}
    />
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function SkeletonCard() {
  return (
    <div className="rounded-2xl border border-gray-100 bg-white p-4 flex flex-col gap-3 animate-pulse">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-100" />
        <div className="flex flex-col gap-1.5 flex-1">
          <div className="h-3.5 bg-gray-100 rounded w-32" />
          <div className="h-2.5 bg-gray-100 rounded w-20" />
        </div>
        <div className="h-5 w-16 bg-gray-100 rounded-full" />
      </div>
      <div className="h-2.5 bg-gray-100 rounded w-40" />
      <div className="rounded-xl overflow-hidden border border-gray-100">
        <div className="h-7 bg-gray-100" />
        {[1, 2].map((i) => (
          <div
            key={i}
            className="flex justify-between px-3 py-2.5 border-t border-gray-100"
          >
            <div className="h-2.5 bg-gray-100 rounded w-20" />
            <div className="h-2.5 bg-gray-100 rounded w-16" />
          </div>
        ))}
      </div>
      <div className="h-8 bg-gray-100 rounded-xl" />
      <div className="h-9 bg-gray-100 rounded-xl" />
    </div>
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
function ConfirmModal({ referral, onClose }) {
  const { mutateAsync: receive } = useReceiveReferral();
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await receive(referral.id);
      setDone(true);
      setTimeout(() => onClose("confirmed"), 1600);
    } catch {
      setLoading(false);
    }
  };

  const [firstName, ...rest] = referral.patientName.split(" ");
  const lastName = rest.join(" ");

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
        className="w-full sm:max-w-[500px] bg-white rounded-t-3xl sm:rounded-2xl shadow-2xl overflow-hidden max-h-[92dvh] flex flex-col"
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
                className="absolute inset-0 rounded-full bg-green-400/20"
                animate={{ scale: [1, 2.1], opacity: [0.5, 0] }}
                transition={{
                  duration: 1.1,
                  repeat: Infinity,
                  ease: "easeOut",
                }}
              />
              <div className="relative w-full h-full rounded-full bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center">
                <MdCheck size={28} color="#fff" />
              </div>
            </motion.div>
            <p className="text-lg font-bold text-gray-900">Patient Received!</p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              <strong>{referral.patientName}</strong>'s arrival confirmed.
              <br />
              Saved:{" "}
              <strong className="text-green-600">
                {referral.totalSaved} EGP
              </strong>
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            {/* header */}
            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 shrink-0">
              <AvatarIcon
                user={{ firstName, lastName }}
                size="40"
                className="gap-2.5"
              />
              <button
                onClick={() => onClose(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer shrink-0 ml-2"
              >
                <MdClose size={17} />
              </button>
            </div>

            {/* body */}
            <div className="px-4 sm:px-5 py-4 flex flex-col gap-3.5 overflow-y-auto flex-1">
              {/* patient details */}
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <div
                  className="px-4 py-2.5 flex items-center gap-2"
                  style={{ background: BLUE }}
                >
                  <MdPerson size={14} className="text-white/80 shrink-0" />
                  <p className="text-[11px] text-white uppercase tracking-wider font-medium">
                    Patient Details
                  </p>
                </div>
                <div className="bg-white px-4 py-3 flex flex-col gap-2.5">
                  {[
                    { icon: MdPhone, val: referral.patientPhone },
                    { icon: MdEmail, val: referral.patientEmail },
                    {
                      icon: FaUserDoctor,
                      val: referral.doctorName,
                    },
                    {
                      icon: MdCalendarToday,
                      val: `Referred: ${fmt(referral.referredAtUtc)}`,
                    },
                  ].map(({ icon: Icon, val }) => (
                    <div key={val} className="flex items-center gap-2">
                      <Icon size={14} className="text-gray-400 shrink-0" />
                      <span className="text-sm text-gray-700 truncate">
                        {val}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* services */}
              <div
                className="rounded-xl overflow-hidden border"
                style={{ borderColor: "#C7D8F9" }}
              >
                <div
                  className="px-4 py-2.5 flex items-center gap-2"
                  style={{ background: BLUE }}
                >
                  <MdScience size={14} className="text-white/80 shrink-0" />
                  <p className="text-[11px] text-white uppercase tracking-wider font-medium">
                    Required Services
                  </p>
                  <span className="ml-auto bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {referral.services.length}
                  </span>
                </div>
                <div className="bg-white divide-y divide-gray-100">
                  {referral.services.map((s, i) => (
                    <div
                      key={s.providerOfferingId}
                      className="flex items-center justify-between px-4 py-2.5 gap-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold text-white shrink-0"
                          style={{ background: BLUE }}
                        >
                          {i + 1}
                        </span>
                        <span className="text-sm font-semibold text-gray-800">
                          {s.serviceName}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 line-through">
                          {s.priceBeforeDiscount}
                        </span>
                        <span className="text-sm font-bold text-green-700">
                          {s.priceAfterDiscount} EGP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* total */}
              <div className="rounded-xl border border-green-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-green-600 flex items-center">
                  <p className="text-[11px] text-white uppercase tracking-wider font-medium">
                    Total
                  </p>
                  <span className="ml-auto bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {referral.discountPercentage}% off
                  </span>
                </div>
                <div className="bg-white px-4 py-3 flex items-center justify-between gap-2">
                  {[
                    {
                      label: "Before",
                      value: referral.totalBeforeDiscount,
                      color: "text-gray-400",
                      strike: true,
                    },
                    {
                      label: "After",
                      value: referral.totalAfterDiscount,
                      color: "text-green-700",
                      labelColor: "text-green-500",
                      big: true,
                    },
                    {
                      label: "Saving",
                      value: referral.totalSaved,
                      color: "",
                      labelColor: "",
                    },
                  ].map(
                    (
                      { label, value, color, labelColor, strike, big },
                      i,
                      arr,
                    ) => (
                      <>
                        <div
                          key={label}
                          className="flex flex-col items-center flex-1"
                        >
                          <span
                            className={`text-[10px] uppercase tracking-wider mb-1 ${labelColor || "text-gray-400"}`}
                          >
                            {label}
                          </span>
                          <span
                            className={`font-black ${big ? "text-2xl text-green-700" : "text-lg"} ${color} ${strike ? "line-through" : ""}`}
                            style={label === "Saving" ? { color: BLUE } : {}}
                          >
                            {value} EGP
                          </span>
                        </div>
                        {i < arr.length - 1 && (
                          <div className="w-px h-10 bg-gray-100" />
                        )}
                      </>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* footer */}
            <div className="flex gap-2 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={() => onClose(null)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <motion.button
                whileHover={{ y: -1 }}
                whileTap={{ scale: 0.97 }}
                disabled={loading}
                onClick={handleConfirm}
                className="flex-[2] py-2.5 text-sm font-semibold rounded-xl text-white flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 cursor-pointer"
                style={{ background: BLUE }}
              >
                {loading ? (
                  <Spinner />
                ) : (
                  <>
                    <MdCheckCircle size={15} /> Confirm Arrival
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

// ─── PatientCard ──────────────────────────────────────────────────────────────
function PatientCard({ referral, index, onConfirm }) {
  const isReceived = referral.status === 1;
  const [firstName, ...rest] = referral.patientName.split(" ");
  const lastName = rest.join(" ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`rounded-2xl border p-3.5 sm:p-4 flex flex-col gap-2.5 sm:gap-3 overflow-hidden transition-shadow h-[420px]
        ${isReceived ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:shadow-md"}`}
    >
      {/* top row */}
      <div className="flex items-start justify-between gap-2 shrink-0">
        <AvatarIcon
          user={{ firstName, lastName }}
          size="40"
          className="gap-2.5 min-w-0 flex-1"
        />
        <div
          className={`shrink-0 flex items-center gap-1 px-2 py-1 rounded-full text-[10px] sm:text-[11px] font-semibold border
          ${isReceived ? "bg-green-100 border-green-200 text-green-700" : "bg-blue-50 text-blue-700"}`}
          style={!isReceived ? { borderColor: "#C7D8F9" } : {}}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full shrink-0 ${isReceived ? "bg-green-500" : "bg-blue-400"}`}
            style={!isReceived ? { background: BLUE } : {}}
          />
          <span className="whitespace-nowrap">
            {isReceived ? "Received" : "Pending"}
          </span>
        </div>
      </div>

      {/* contact + doctor */}
      <div className="flex flex-col gap-1 shrink-0">
        <div
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{ color: BLUE }}
        >
          <MdPhone size={12} className="shrink-0" />
          <span>{referral.patientPhone}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FaUserDoctor size={11} className="shrink-0 text-gray-400" />
          <span className="font-medium text-gray-700 truncate">
            {referral.doctorName}
          </span>
        </div>
      </div>

      {/* services — scrollable, takes remaining space */}
      <div
        className="rounded-xl overflow-hidden border flex flex-col min-h-0 flex-1"
        style={{ borderColor: "#C7D8F9" }}
      >
        {/* sticky header */}
        <div
          className="px-3 py-1.5 flex items-center gap-1.5 shrink-0"
          style={{ background: BLUE }}
        >
          <MdScience size={12} className="text-white/80 shrink-0" />
          <p className="text-[10px] text-white font-semibold uppercase tracking-wider">
            Services
          </p>
          <span className="ml-auto bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {referral.services.length}
          </span>
        </div>

        {/* scrollable rows */}
        <div className="bg-white divide-y divide-gray-100 overflow-y-auto">
          {referral.services.map((s, i) => (
            <div
              key={s.providerOfferingId}
              className="flex items-center justify-between px-3 py-2 gap-2"
            >
              <div className="flex items-center gap-2 min-w-0">
                <span
                  className="w-4 h-4 rounded-full flex items-center justify-center text-[9px] font-bold text-white shrink-0"
                  style={{ background: BLUE }}
                >
                  {i + 1}
                </span>
                <span className="text-xs font-semibold text-gray-800 truncate">
                  {s.serviceName}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-gray-400 line-through">
                  {s.priceBeforeDiscount}
                </span>
                <span className="text-xs font-bold text-green-700">
                  {s.priceAfterDiscount} EGP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* total row */}
      <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2 shrink-0">
        <span className="text-xs text-gray-400 line-through shrink-0">
          {referral.totalBeforeDiscount} EGP
        </span>
        <span className="text-gray-300">→</span>
        <span className="text-sm font-black text-green-700 shrink-0">
          {referral.totalAfterDiscount} EGP
        </span>
        <span
          className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 text-white"
          style={{ background: BLUE }}
        >
          {referral.discountPercentage}% off
        </span>
      </div>

      {/* dates */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 shrink-0">
        <span className="flex items-center gap-1">
          <MdCalendarToday size={10} />
          Referred: {fmt(referral.referredAtUtc)}
        </span>
        {referral.receivedAtUtc && (
          <span className="flex items-center gap-1 text-green-600">
            <MdCheckCircle size={10} />
            Received: {fmt(referral.receivedAtUtc)}
          </span>
        )}
      </div>

      {/* action */}
      <div className="shrink-0">
        {!isReceived ? (
          <motion.button
            whileHover={{ y: -1 }}
            whileTap={{ scale: 0.97 }}
            onClick={() => onConfirm(referral)}
            className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-white text-xs font-semibold cursor-pointer"
            style={{ background: BLUE }}
          >
            <MdCheckCircle size={14} /> Confirm Arrival
          </motion.button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs text-green-700 font-semibold">
            <MdCheckCircle size={14} className="text-green-500" />
            Received · Discount applied
          </div>
        )}
      </div>
    </motion.div>
  );
}
// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ReferredPatients() {
  const [tab, setTab] = useState(0); // 0 = pending, 1 = received
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [confirmReferral, setConfirmReferral] = useState(null);
  const PAGE_SIZE = 12;

  const { data, isLoading, isError } = useReferredPatients({
    page,
    pageSize: PAGE_SIZE,
    status: tab,
  });

  const items = data?.items ?? [];
  const totalCount = data?.totalCount ?? 0;
  const hasNext = data?.hasNextPage ?? false;
  const hasPrev = data?.hasPreviousPage ?? false;

  // Client-side search filter on top of server data
  const filtered = items.filter((r) =>
    `${r.patientName} ${r.doctorName} ${r.services.map((s) => s.serviceName).join(" ")}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  // Reset page when tab changes
  const handleTabChange = (key) => {
    setTab(key);
    setPage(1);
    setSearch("");
  };

  const handleConfirmClose = (result) => {
    setConfirmReferral(null);
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4 sm:gap-5">
        {/* header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-gray-900">
              Referred Patients
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {isLoading
                ? "Loading…"
                : `${totalCount} ${tab === 0 ? "pending" : "received"}`}
            </p>
          </div>
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: BLUE }}
          >
            <PiFlask size={17} color="#fff" />
          </div>
        </motion.div>

        {/* tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="flex gap-1.5 p-1 bg-gray-100 rounded-2xl"
        >
          {TABS.map(({ key, label }) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => handleTabChange(key)}
                className={`relative flex-1 flex items-center justify-center h-8 sm:h-9 px-2 rounded-xl text-[12px] sm:text-[13px] font-semibold transition-colors duration-200 cursor-pointer
                  ${isActive ? "text-gray-900" : "text-gray-500 hover:text-gray-700"}`}
              >
                {isActive && (
                  <motion.div
                    layoutId="pt-tab-bg"
                    className="absolute inset-0 rounded-xl bg-white shadow-sm"
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative">{label}</span>
              </button>
            );
          })}
        </motion.div>

        {/* search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="relative"
        >
          <MdSearch
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient, doctor or service…"
            className="w-full pl-9 pr-9 py-2.5 text-sm rounded-xl border border-gray-200 outline-none transition-all placeholder:text-gray-400"
            onFocus={(e) => (e.target.style.borderColor = BLUE)}
            onBlur={(e) => (e.target.style.borderColor = "#e5e7eb")}
          />
          <AnimatePresence>
            {search && (
              <motion.button
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                onClick={() => setSearch("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center cursor-pointer"
              >
                <MdClose size={11} className="text-gray-600" />
              </motion.button>
            )}
          </AnimatePresence>
        </motion.div>

        {/* error state */}
        {isError && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
              <MdInfo size={20} className="text-red-400" />
            </div>
            <p className="text-sm font-medium text-red-400">
              Failed to load referrals
            </p>
          </div>
        )}

        {/* grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)
            ) : filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center gap-3 py-14 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <MdPerson size={20} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  No patients found
                </p>
              </motion.div>
            ) : (
              filtered.map((r, i) => (
                <PatientCard
                  key={r.id}
                  referral={r}
                  index={i}
                  onConfirm={setConfirmReferral}
                />
              ))
            )}
          </AnimatePresence>
        </div>

        {/* pagination */}
        {!isLoading && (hasPrev || hasNext) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex items-center justify-center gap-2 pt-2"
          >
            <button
              disabled={!hasPrev}
              onClick={() => setPage((p) => p - 1)}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-400 px-2">Page {page}</span>
            <button
              disabled={!hasNext}
              onClick={() => setPage((p) => p + 1)}
              className="px-4 py-2 text-sm rounded-xl border border-gray-200 text-gray-500 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              Next →
            </button>
          </motion.div>
        )}
      </div>

      <AnimatePresence>
        {confirmReferral && (
          <ConfirmModal
            referral={confirmReferral}
            onClose={handleConfirmClose}
          />
        )}
      </AnimatePresence>
    </>
  );
}
