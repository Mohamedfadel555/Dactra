import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdSearch, MdClose, MdVerified, MdBlock } from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { TbPlugConnectedX } from "react-icons/tb";
import AvatarIcon from "../../Components/Common/AvatarIcon1";
import { useSponsoredDoctors } from "../../hooks/useSponsoredDoctors";
import { useProviderCancelDeal } from "../../hooks/useProviderCancelDeal";

const BLUE = "#316BE8";

const fmtSince = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;

const splitName = (fullName = "") => {
  const [first, ...rest] = fullName.split(" ").filter(Boolean);
  return { firstName: first || "", lastName: rest.join(" ") };
};

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block shrink-0"
    />
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
      className="col-span-full w-full py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-500 font-medium flex items-center justify-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-gray-200 border-t-gray-500 rounded-full inline-block shrink-0"
        />
      ) : (
        "Load more"
      )}
    </motion.button>
  );
}

// ─── CancelModal ─────────────────────────────────────────────────────────────
function CancelModal({ doctor, onClose }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const { firstName, lastName } = splitName(doctor.doctorName);

  const cancelMutation = useProviderCancelDeal();

  const handleCancel = async () => {
    setLoading(true);
    await cancelMutation.mutateAsync(doctor.sponsorshipId);
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
                <TbPlugConnectedX size={26} color="#fff" />
              </div>
            </motion.div>
            <p className="text-lg font-bold text-gray-900">
              Sponsorship Cancelled
            </p>
            <p className="text-sm text-gray-500 leading-relaxed max-w-xs">
              {doctor.doctorName} has been removed from your sponsored doctors
              list.
            </p>
          </motion.div>
        ) : (
          <>
            <div className="flex justify-center pt-3 pb-1 sm:hidden shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-200" />
            </div>

            <div className="flex items-center justify-between px-4 sm:px-5 py-3 sm:py-4 border-b border-gray-100 shrink-0">
              <AvatarIcon
                user={{ firstName, lastName }}
                size="38"
                className="gap-2.5 min-w-0"
              />
              <button
                onClick={() => onClose(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors cursor-pointer shrink-0 ml-2"
              >
                <MdClose size={17} />
              </button>
            </div>

            <div className="px-4 sm:px-5 py-4 flex flex-col gap-3 overflow-y-auto flex-1">
              <div className="rounded-xl overflow-hidden border border-gray-200">
                <div
                  className="px-4 py-3 flex items-center gap-3"
                  style={{ background: BLUE }}
                >
                  <div className="w-10 h-10 rounded-xl bg-white/15 flex flex-col items-center justify-center shrink-0">
                    <span className="text-base font-black text-white leading-none">
                      {doctor.discountPercentage}
                    </span>
                    <span className="text-[9px] text-white/70">%</span>
                  </div>
                  <p className="text-sm text-white/90 leading-relaxed flex-1">
                    {doctor.description}
                  </p>
                </div>
                <div className="px-4 py-2 bg-gray-50 flex items-center gap-1.5 text-xs text-gray-500">
                  <FaUserDoctor size={11} className="shrink-0" />
                  <span>
                    {doctor.patientsSentCount} patients · Since{" "}
                    {fmtSince(doctor.offerDate)}
                  </span>
                </div>
              </div>

              <div className="flex gap-2.5 items-start rounded-xl px-3.5 py-3 bg-rose-50 border border-rose-200">
                <MdBlock size={15} className="text-rose-500 shrink-0 mt-0.5" />
                <p className="text-xs text-rose-800 leading-relaxed">
                  This will permanently remove{" "}
                  <strong>{doctor.doctorName}</strong> from your sponsored list.
                  Patients will no longer receive the discount.
                </p>
              </div>
            </div>

            <div className="flex gap-2 px-4 sm:px-5 py-3 sm:py-4 border-t border-gray-100 shrink-0">
              <button
                onClick={() => onClose(null)}
                className="flex-1 py-2.5 text-sm border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                Keep Active
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
                    <TbPlugConnectedX size={15} /> Cancel Sponsorship
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

// ─── DoctorCard ───────────────────────────────────────────────────────────────
function DoctorCard({ doctor, index, onCancel }) {
  const { firstName, lastName } = splitName(doctor.doctorName);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className="bg-white rounded-2xl border border-gray-200 p-3.5 sm:p-4 flex flex-col gap-2.5 overflow-hidden hover:shadow-md transition-shadow duration-200"
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1 min-w-0 flex-1 cursor-pointer">
          <AvatarIcon
            user={{ firstName, lastName }}
            size="40"
            className="gap-2 min-w-0 flex-1"
          />
          <MdVerified size={14} style={{ color: BLUE }} className="shrink-0" />
        </div>
        <div
          className="shrink-0 flex flex-col items-center justify-center w-10 h-10 rounded-xl"
          style={{ background: BLUE }}
        >
          <span className="text-sm font-black text-white leading-none">
            {doctor.discountPercentage}
          </span>
          <span className="text-[8px] text-white/70">%</span>
        </div>
      </div>

      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 cursor-pointer">
        {doctor.description}
      </p>

      <div className="flex items-center justify-between gap-2 cursor-pointer">
        <div
          className="flex items-center gap-1 text-xs font-medium"
          style={{ color: BLUE }}
        >
          <FaUserDoctor size={11} />
          <span>{doctor.patientsSentCount} patients</span>
        </div>
        <span className="text-[11px] text-gray-400">
          Since {fmtSince(doctor.offerDate)}
        </span>
      </div>

      <motion.button
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.97 }}
        onClick={(e) => {
          e.stopPropagation();
          onCancel(doctor);
        }}
        className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl border border-rose-200 bg-rose-50 text-rose-600 text-xs font-semibold hover:bg-rose-100 transition-colors cursor-pointer"
      >
        <TbPlugConnectedX size={13} /> Cancel Sponsorship
      </motion.button>
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function SponsoredDoctors() {
  const [search, setSearch] = useState("");
  const [cancelDoc, setCancelDoc] = useState(null);

  // FIX: useOffersByStat بيرجع infinite query
  const {
    data: sponsoredData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useSponsoredDoctors();

  // FIX: flatten كل الـ pages في array واحدة
  const allDoctors = sponsoredData?.pages.flatMap((page) => page.items) ?? [];

  // FIX: السيرش كان بيستخدم d.name و d.specialization بس الـ API بيرجع doctorName و doctorSpeciality
  const filtered = allDoctors.filter((d) =>
    `${d.doctorName} ${d.doctorSpeciality}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const totalPatients = sponsoredData?.pages[0]?.totalPatientsSent ?? 0;
  const averageDiscount = sponsoredData?.pages[0]?.averageDiscount ?? "—";

  const handleCancelClose = (result) => {
    setCancelDoc(null);
    // الـ query هتعمل refetch تلقائي بعد الـ mutation
  };

  return (
    <>
      <div className="w-full flex flex-col gap-4 sm:gap-5">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between"
        >
          <div>
            <h1 className="text-xl sm:text-2xl font-black text-gray-900 tracking-tight">
              Sponsored Doctors
            </h1>
            <p className="text-xs sm:text-sm text-gray-400 mt-0.5">
              {allDoctors.length} active · {totalPatients} patients referred
            </p>
          </div>
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: BLUE }}
          >
            <FaUserDoctor size={17} color="#fff" />
          </div>
        </motion.div>

        {/* Summary pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="grid grid-cols-3 gap-2 sm:gap-3"
        >
          {[
            { label: "Doctors", value: allDoctors.length, bg: BLUE },
            { label: "Patients", value: totalPatients, bg: "#16a34a" },
            {
              label: "Avg Disc",
              value: averageDiscount ? `${averageDiscount}%` : "—",
              bg: "#f59e0b",
            },
          ].map(({ label, value, bg }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.08 + i * 0.04 }}
              className="rounded-2xl px-3 py-2.5 sm:px-4 sm:py-3 flex flex-col text-white"
              style={{ background: bg }}
            >
              <span className="text-[10px] sm:text-xs opacity-75 font-medium">
                {label}
              </span>
              <span className="text-lg sm:text-2xl font-black leading-tight">
                {value}
              </span>
            </motion.div>
          ))}
        </motion.div>

        {/* Search */}
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
            placeholder="Search by name or specialization…"
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
          <AnimatePresence mode="popLayout">
            {filtered.length === 0 ? (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="col-span-full flex flex-col items-center gap-3 py-14 text-center"
              >
                <div className="w-12 h-12 rounded-2xl bg-gray-100 flex items-center justify-center">
                  <MdSearch size={20} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  No doctors found
                </p>
              </motion.div>
            ) : (
              filtered.map((doc, i) => (
                <DoctorCard
                  key={doc.sponsorshipId ?? doc._id}
                  doctor={doc}
                  index={i}
                  onCancel={setCancelDoc}
                />
              ))
            )}
          </AnimatePresence>

          {/* FIX: Pagination — Load More */}
          {hasNextPage && !search && (
            <LoadMoreButton
              onClick={() => fetchNextPage()}
              loading={isFetchingNextPage}
            />
          )}
        </div>
      </div>

      <AnimatePresence>
        {cancelDoc && (
          <CancelModal doctor={cancelDoc} onClose={handleCancelClose} />
        )}
      </AnimatePresence>
    </>
  );
}
