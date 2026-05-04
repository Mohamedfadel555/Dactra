import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiSearchLine,
  RiUserLine,
  RiPhoneLine,
  RiMailLine,
} from "react-icons/ri";
import { useGetCarePatients } from "../../hooks/useGetCarePatients";

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

export default function PatientsPage() {
  const { data, isLoading, isError } = useGetCarePatients();
  const [query, setQuery] = useState("");

  const patients = data?.patients ?? [];
  const totalPatients = data?.totalPatients ?? 0;

  const filtered = useMemo(
    () =>
      patients.filter(
        (p) =>
          !query ||
          p.patientName?.toLowerCase().includes(query.toLowerCase()) ||
          p.email?.toLowerCase().includes(query.toLowerCase()) ||
          p.phoneNumber?.includes(query),
      ),
    [patients, query],
  );

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
      {/* Stats */}
      <motion.div variants={fadeUp} className="grid grid-cols-2 gap-4">
        {[
          { l: "Under care", v: totalPatients, bg: "bg-blue-600" },
          { l: "Showing", v: filtered.length, bg: "bg-slate-700" },
        ].map(({ l, v, bg }) => (
          <div key={l} className={`${bg} rounded-2xl px-5 py-4 text-white`}>
            <p className="text-[12px] font-medium opacity-70 mb-1">{l}</p>
            <p className="text-[30px] font-extrabold leading-none">{v}</p>
          </div>
        ))}
      </motion.div>

      {/* Search */}
      <motion.div variants={fadeUp} className="relative">
        <RiSearchLine className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, email or phone…"
          className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white focus:border-blue-400 outline-none text-[13px] text-slate-900"
        />
      </motion.div>

      {/* Table */}
      <motion.div
        variants={fadeUp}
        className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm"
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
            filtered.map((p, i) => {
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
                  {/* Name */}
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-bold flex-shrink-0"
                      style={{ background: color + "22", color }}
                    >
                      {ini(p.patientName)}
                    </div>
                    <span className="text-[13px] text-slate-800 font-medium truncate">
                      {p.patientName}
                    </span>
                  </div>

                  {/* Phone */}
                  <div className="flex items-center gap-1.5 text-[12.5px] text-slate-500">
                    <RiPhoneLine className="text-slate-300 shrink-0" />
                    {p.phoneNumber || "—"}
                  </div>

                  {/* Email */}
                  <div className="flex items-center gap-1.5 text-[12px] text-slate-400 truncate">
                    <RiMailLine className="text-slate-300 shrink-0" />
                    <span className="truncate">{p.email || "—"}</span>
                  </div>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}
