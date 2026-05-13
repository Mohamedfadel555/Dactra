// src/pages/PatientsPage.jsx
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  RiSearchLine,
  RiPhoneLine,
  RiMailLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { useGetCarePatients } from "../../hooks/useGetCarePatients";
import AvatarIcon from "./../../Components/Common/AvatarIcon1";

const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.05 } } };
const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22 } },
};

const COLORS = [
  "#3B82F6",
  "#10B981",
  "#F59E0B",
  "#EF4444",
  "#8B5CF6",
  "#06B6D4",
  "#F97316",
  "#EC4899",
];

const ini = (n = "") =>
  n
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

function LoadMoreButton({ onClick, loading }) {
  return (
    <motion.button
      whileHover={{ y: -1 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      disabled={loading}
      className="w-full py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-500 font-medium flex items-center justify-center gap-2 hover:bg-slate-50 transition-colors disabled:opacity-50 cursor-pointer"
    >
      {loading ? (
        <motion.span
          animate={{ rotate: 360 }}
          transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
          className="w-4 h-4 border-2 border-slate-200 border-t-slate-500 rounded-full inline-block"
        />
      ) : (
        "Load more"
      )}
    </motion.button>
  );
}

export default function PatientsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");

  const {
    data,
    isLoading,
    isError,
    isFetching,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isDebouncing,
  } = useGetCarePatients(query);

  const patients = data?.pages.flatMap((page) => page.items) ?? [];
  const totalCount = data?.pages[0]?.totalCount ?? 0;
  const isStale = isDebouncing || isFetching;

  if (isLoading)
    return (
      <div className="text-center py-20 text-slate-400 text-sm">
        Loading patients…
      </div>
    );

  if (isError)
    return (
      <div className="text-center py-20 text-rose-400 text-sm">
        Failed to load patients.
      </div>
    );

  return (
    <motion.div
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-5"
    >
      {/* Search */}
      <motion.div variants={fadeUp} className="relative">
        <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-400 outline-none text-[13px] text-slate-900"
        />
        {isStale && (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
            className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 border-2 border-slate-200 border-t-blue-400 rounded-full"
          />
        )}
      </motion.div>

      {/* Table */}
      <motion.div
        variants={fadeUp}
        className={`bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-opacity duration-200 ${isStale ? "opacity-60" : "opacity-100"}`}
      >
        <div className="grid grid-cols-3 px-5 py-3 bg-slate-50 border-b border-slate-100">
          {["Patient", "Phone", "Email"].map((h) => (
            <span
              key={h}
              className="text-[11px] font-semibold uppercase tracking-wider text-slate-400"
            >
              {h}
            </span>
          ))}
        </div>

        <AnimatePresence mode="popLayout">
          {patients.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-12 text-slate-400 text-sm"
            >
              {query ? `No results for "${query}"` : "No patients found"}
            </motion.p>
          ) : (
            patients.map((p, i) => {
              const color = COLORS[p.patientId % COLORS.length];
              return (
                <motion.div
                  key={p.patientId}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{
                    opacity: 1,
                    x: 0,
                    transition: { delay: i * 0.04 },
                  }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-3 px-5 py-3.5 border-b border-slate-50 last:border-0 items-center hover:bg-slate-50/70 transition-colors"
                >
                  <button
                    onClick={() => navigate(`/patient/profile/${p.patientId}`)}
                    className="flex items-center gap-3 group text-left w-full"
                  >
                    <AvatarIcon user={{ imageUrl: p.profilePictureUrl }} />
                    <span className="text-[13px] text-slate-800 font-medium truncate group-hover:text-blue-600 transition-colors">
                      {p.patientName}
                    </span>
                    <RiArrowRightSLine className="text-slate-300 group-hover:text-blue-400 shrink-0 transition-all -translate-x-1 group-hover:translate-x-0 opacity-0 group-hover:opacity-100" />
                  </button>

                  {p.phoneNumber ? (
                    <a
                      href={`tel:${p.phoneNumber}`}
                      className="flex items-center gap-1.5 text-[12.5px] text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      <RiPhoneLine className="text-slate-300 shrink-0" />
                      {p.phoneNumber}
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                      <RiPhoneLine className="text-slate-300 shrink-0" />—
                    </div>
                  )}

                  {p.email ? (
                    <a
                      href={`mailto:${p.email}`}
                      className="flex items-center gap-1.5 text-[12px] text-slate-400 truncate hover:text-blue-600 transition-colors"
                    >
                      <RiMailLine className="text-slate-300 shrink-0" />
                      <span className="truncate">{p.email}</span>
                    </a>
                  ) : (
                    <div className="flex items-center gap-1.5 text-[12px] text-slate-400 truncate">
                      <RiMailLine className="text-slate-300 shrink-0" />
                      <span>—</span>
                    </div>
                  )}
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>

      {/* Load More */}
      {hasNextPage && !isStale && (
        <LoadMoreButton
          onClick={() => fetchNextPage()}
          loading={isFetchingNextPage}
        />
      )}
    </motion.div>
  );
}
