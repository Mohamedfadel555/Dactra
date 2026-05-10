import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiSearch,
  FiStar,
  FiChevronLeft,
  FiChevronRight,
  FiExternalLink,
} from "react-icons/fi";
import { MdOutlineLocalHospital } from "react-icons/md";
import { HiOutlineUserGroup } from "react-icons/hi2";
import { RiStethoscopeLine } from "react-icons/ri";

// ─── replace these with your real hook + Deal component ───────────────────────
import { useDoctors } from "../../hooks/useDoctors";
import { Deal } from "../../Components/Provider/Deal";
import AvatarIcon from "../../Components/Common/AvatarIcon1";
import { Link } from "react-router-dom";
// ─────────────────────────────────────────────────────────────────────────────

const SPEC_COLORS = {
  Dermatology: { bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-400" },
  "General Surgery": {
    bg: "bg-orange-50",
    text: "text-orange-600",
    dot: "bg-orange-400",
  },
  Neurology: {
    bg: "bg-violet-50",
    text: "text-violet-600",
    dot: "bg-violet-400",
  },
  Ophthalmology: { bg: "bg-sky-50", text: "text-sky-600", dot: "bg-sky-400" },
  Orthopedics: { bg: "bg-teal-50", text: "text-teal-600", dot: "bg-teal-400" },
  Endocrinology: {
    bg: "bg-amber-50",
    text: "text-amber-600",
    dot: "bg-amber-400",
  },
  Pulmonology: { bg: "bg-cyan-50", text: "text-cyan-600", dot: "bg-cyan-400" },
};

function getSpec(spec) {
  return (
    SPEC_COLORS[spec] ?? {
      bg: "bg-slate-50",
      text: "text-slate-600",
      dot: "bg-slate-400",
    }
  );
}

function initials(name) {
  return name
    .split(" ")
    .slice(0, 2)
    .map((w) => w[0])
    .join("")
    .toUpperCase();
}

const AVATAR_GRADIENTS = [
  "from-rose-400 to-pink-600",
  "from-violet-400 to-indigo-600",
  "from-sky-400 to-blue-600",
  "from-teal-400 to-cyan-600",
  "from-amber-400 to-orange-500",
  "from-emerald-400 to-green-600",
];

function Avatar({ name, imageUrl, index }) {
  const gradient = AVATAR_GRADIENTS[index % AVATAR_GRADIENTS.length];
  if (imageUrl) {
    return (
      <img
        src={imageUrl}
        alt={name}
        className="w-16 h-16 rounded-2xl object-cover ring-2 ring-white shadow-md"
      />
    );
  }
  return (
    <div
      className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient} flex items-center justify-center text-white text-xl font-semibold shadow-md ring-2 ring-white`}
    >
      {initials(name)}
    </div>
  );
}

const cardVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay: i * 0.06, duration: 0.35, ease: [0.25, 0.1, 0.25, 1] },
  }),
  exit: { opacity: 0, scale: 0.94, transition: { duration: 0.2 } },
};

function DoctorCard({ doctor, index, onDeal }) {
  const spec = getSpec(doctor.specialization);
  const rating = doctor.averageRating ?? 0;
  console.log(doctor);

  return (
    <motion.div
      custom={index}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      layout
      className="group relative bg-white rounded-3xl border border-slate-100 p-5 flex flex-col gap-4 hover:shadow-xl hover:shadow-slate-200/60 hover:-translate-y-1 transition-all duration-300"
    >
      {/* top accent line */}
      <div className="absolute top-0 left-6 right-6 h-0.5 rounded-full bg-gradient-to-r from-transparent via-slate-200 to-transparent group-hover:via-blue-300 transition-all duration-500" />

      {/* header */}
      <div className="flex items-start gap-4">
        <AvatarIcon
          showLabel={false}
          user={{ imageUrl: doctor.profileImageUrl }}
          size="60"
        />
        <div className="flex-1 min-w-0 pt-1">
          <Link
            to={`/doctor/profile/${doctor.id}`}
            className="group inline-flex items-center gap-1 font-black text-slate-800 text-sm leading-tight hover:text-blue-600 transition-colors"
          >
            <span className="truncate">{doctor.name}</span>
            <FiExternalLink
              size={11}
              className="opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0"
            />
          </Link>
          <div className="flex items-center gap-1.5 mt-2">
            <span
              className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${spec.bg} ${spec.text}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${spec.dot}`} />
              {doctor.specialization}
            </span>
          </div>
        </div>
      </div>

      {/* rating */}
      <div className="flex items-center gap-1.5 px-1">
        {rating > 0 ? (
          <>
            {[1, 2, 3, 4, 5].map((s) => (
              <FiStar
                key={s}
                size={13}
                className={
                  s <= Math.round(rating)
                    ? "text-amber-400 fill-amber-400"
                    : "text-slate-200"
                }
              />
            ))}
            <span className="text-xs text-slate-500 ml-1">
              {rating.toFixed(1)}
            </span>
          </>
        ) : (
          <span className="text-xs text-slate-400 italic">No rating yet</span>
        )}
      </div>

      {/* action */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => onDeal(doctor)}
        className="w-full mt-auto py-2.5 rounded-2xl bg-gradient-to-r from-blue-600 to-blue-500 text-white text-sm font-semibold tracking-wide shadow-sm shadow-blue-200 hover:shadow-md hover:shadow-blue-300 hover:from-blue-700 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
      >
        <RiStethoscopeLine size={16} />
        Make a deal
      </motion.button>
    </motion.div>
  );
}

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-center gap-3 bg-white rounded-2xl border border-slate-100 px-4 py-3 shadow-sm`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}
      >
        <Icon size={18} className="text-white" />
      </div>
      <div>
        <p className="text-[11px] text-slate-400 font-medium uppercase tracking-wider">
          {label}
        </p>
        <p className="text-xl font-semibold text-slate-800 leading-tight">
          {value}
        </p>
      </div>
    </motion.div>
  );
}

function Pagination({ currentPage, totalPages, hasPrevious, hasNext, onPage }) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center justify-between pt-4 border-t border-slate-100"
    >
      <p className="text-sm text-slate-400">
        Page <span className="font-medium text-slate-600">{currentPage}</span>{" "}
        of <span className="font-medium text-slate-600">{totalPages}</span>
      </p>

      <div className="flex items-center gap-1.5">
        <button
          disabled={!hasPrevious}
          onClick={() => onPage(currentPage - 1)}
          className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          <FiChevronLeft size={15} />
        </button>

        {pages.map((p) => (
          <motion.button
            key={p}
            whileTap={{ scale: 0.92 }}
            onClick={() => onPage(p)}
            className={`w-8 h-8 rounded-xl text-sm font-medium transition-all duration-150 ${
              p === currentPage
                ? "bg-blue-600 text-white shadow-sm shadow-blue-200"
                : "border border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
            }`}
          >
            {p}
          </motion.button>
        ))}

        <button
          disabled={!hasNext}
          onClick={() => onPage(currentPage + 1)}
          className="w-8 h-8 rounded-xl border border-slate-200 flex items-center justify-center text-slate-500 hover:border-blue-400 hover:text-blue-600 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-150"
        >
          <FiChevronRight size={15} />
        </button>
      </div>
    </motion.div>
  );
}

export default function Doctors() {
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDoctor, setSelectedDoctor] = useState(null);

  const { data: doctorsResponse, isLoading } = useDoctors(
    currentPage,
    9,
    searchTerm,
  );

  const doctors = doctorsResponse?.doctors ?? [];
  const totalPages = doctorsResponse?.totalPages ?? 1;
  const hasPrevious = doctorsResponse?.hasPrevious ?? false;
  const hasNext = doctorsResponse?.hasNext ?? false;
  const totalCount = doctorsResponse?.totalCount ?? 0;

  const specs = useMemo(
    () => new Set(doctors.map((d) => d.specialization)).size,
    [doctors],
  );

  function handleSearch(e) {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  }

  function handlePage(p) {
    setCurrentPage(p);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  return (
    <div className="w-full flex flex-col gap-6 pb-8">
      {/* ── Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 tracking-tight">
            Doctors
          </h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Browse and connect with specialists
          </p>
        </div>

        <div className="relative">
          <FiSearch
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            size={16}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={handleSearch}
            placeholder="Search by name or specialty..."
            className="pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-white text-sm text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-400 w-full sm:w-64 transition-all duration-200 shadow-sm"
          />
        </div>
      </div>

      {/* ── Grid ── */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl border border-slate-100 p-5 h-48 animate-pulse"
            >
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-2xl bg-slate-100" />
                <div className="flex-1 space-y-2 pt-1">
                  <div className="h-4 bg-slate-100 rounded-full w-3/4" />
                  <div className="h-3 bg-slate-100 rounded-full w-1/2" />
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : doctors.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3"
        >
          <FiSearch size={36} className="opacity-30" />
          <p className="text-sm">No doctors found</p>
        </motion.div>
      ) : (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPage + searchTerm}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          >
            {doctors.map((doc, i) => (
              <DoctorCard
                key={doc.id}
                doctor={doc}
                index={i}
                onDeal={setSelectedDoctor}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      )}

      {/* ── Pagination ── */}
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        hasPrevious={hasPrevious}
        hasNext={hasNext}
        onPage={handlePage}
      />

      {/* ── Deal Modal ── */}
      <AnimatePresence>
        {selectedDoctor && (
          <Deal
            doctor={selectedDoctor}
            onClose={() => setSelectedDoctor(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
