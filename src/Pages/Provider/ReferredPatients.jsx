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
} from "react-icons/md";
import { FaUserDoctor } from "react-icons/fa6";
import { PiFlask } from "react-icons/pi";
import AvatarIcon from "../../Components/Common/AvatarIcon1";

const BLUE = "#316BE8";

// tests now have individual prices (EGP before discount)
const MOCK_PATIENTS = [
  {
    _id: "p1",
    name: "Youssef Mahmoud",
    phone: "+20 100 111 2233",
    age: 45,
    status: "pending",
    tests: [
      { name: "CBC", price: 120 },
      { name: "Lipid Panel", price: 220 },
      { name: "HbA1c", price: 140 },
    ],
    doctor: { name: "Dr. Ahmed Saber", specialization: "Cardiologist" },
    discount: 25,
    appointmentDate: "2025-06-12",
    notes: "Fasting required for lipid panel.",
    referredAt: "2025-06-01",
  },
  {
    _id: "p2",
    name: "Hana Ali",
    phone: "+20 101 444 5566",
    age: 32,
    status: "received",
    tests: [
      { name: "TSH", price: 100 },
      { name: "Free T4", price: 110 },
      { name: "Fasting Glucose", price: 110 },
    ],
    doctor: { name: "Dr. Mona Khalil", specialization: "Endocrinologist" },
    discount: 15,
    appointmentDate: "2025-06-09",
    notes: null,
    referredAt: "2025-05-28",
  },
  {
    _id: "p3",
    name: "Khaled Farouk",
    phone: "+20 102 777 8899",
    age: 58,
    status: "pending",
    tests: [
      { name: "Creatinine", price: 90 },
      { name: "BUN", price: 90 },
      { name: "Uric Acid", price: 120 },
      { name: "eGFR", price: 250 },
    ],
    doctor: { name: "Dr. Omar Nasser", specialization: "Nephrologist" },
    discount: 20,
    appointmentDate: null,
    notes: "Patient has CKD stage 2.",
    referredAt: "2025-06-03",
  },
  {
    _id: "p4",
    name: "Nour El-Din",
    phone: "+20 103 222 3344",
    age: 27,
    status: "received",
    tests: [
      { name: "CBC", price: 120 },
      { name: "Coagulation Profile", price: 280 },
      { name: "Iron Studies", price: 220 },
    ],
    doctor: { name: "Dr. Sara Mostafa", specialization: "Hematologist" },
    discount: 30,
    appointmentDate: "2025-06-07",
    notes: null,
    referredAt: "2025-05-30",
  },
  {
    _id: "p5",
    name: "Amira Gamal",
    phone: "+20 104 888 9900",
    age: 39,
    status: "pending",
    tests: [
      { name: "ABG", price: 300 },
      { name: "Spirometry Panel", price: 350 },
      { name: "Chest X-Ray Markers", price: 250 },
    ],
    doctor: { name: "Dr. Karim Adel", specialization: "Pulmonologist" },
    discount: 20,
    appointmentDate: "2025-06-15",
    notes: "Urgent — shortness of breath.",
    referredAt: "2025-06-04",
  },
  {
    _id: "p6",
    name: "Tarek Samir",
    phone: "+20 105 333 6677",
    age: 51,
    status: "received",
    tests: [
      { name: "ANA", price: 200 },
      { name: "Anti-dsDNA", price: 220 },
      { name: "CRP", price: 160 },
      { name: "ESR", price: 160 },
    ],
    doctor: { name: "Dr. Laila Hassan", specialization: "Rheumatologist" },
    discount: 18,
    appointmentDate: "2025-06-10",
    notes: null,
    referredAt: "2025-06-02",
  },
];

const fmt = (d) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : null;
const totalBefore = (tests) => tests.reduce((s, t) => s + t.price, 0);
const afterPct = (price, pct) => Math.round(price * (1 - pct / 100));
const TABS = [
  { key: "all", label: "All" },
  { key: "pending", label: "Pending" },
  { key: "received", label: "Received" },
];

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ duration: 0.7, repeat: Infinity, ease: "linear" }}
      className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full inline-block shrink-0"
    />
  );
}

// ─── ConfirmModal ─────────────────────────────────────────────────────────────
function ConfirmModal({ patient, onClose }) {
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const base = totalBefore(patient.tests);
  const after = afterPct(base, patient.discount);

  const handleConfirm = async () => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 900));
    setLoading(false);
    setDone(true);
    setTimeout(() => onClose("confirmed"), 1600);
  };

  // split name into firstName / lastName for AvatarIcon
  const [firstName, ...rest] = patient.name.split(" ");
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
              <strong>{patient.name}</strong>'s arrival confirmed.
              <br />
              Discount applied:{" "}
              <strong className="text-green-600">
                {base} → {after} EGP
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
                    { icon: MdPhone, val: patient.phone },
                    {
                      icon: MdCalendarToday,
                      val: `Appointment: ${fmt(patient.appointmentDate) || "Not set"}`,
                    },
                    {
                      icon: FaUserDoctor,
                      val: `${patient.doctor.name} · ${patient.doctor.specialization}`,
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

              {/* tests with individual prices */}
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
                    Required Tests
                  </p>
                  <span className="ml-auto bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {patient.tests.length}
                  </span>
                </div>
                <div className="bg-white divide-y divide-gray-100">
                  {patient.tests.map((t, i) => (
                    <div
                      key={t.name}
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
                          {t.name}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-gray-400 line-through">
                          {t.price}
                        </span>
                        <span className="text-sm font-bold text-green-700">
                          {afterPct(t.price, patient.discount)} EGP
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* total pricing */}
              <div className="rounded-xl border border-green-200 overflow-hidden">
                <div className="px-4 py-2.5 bg-green-600 flex items-center">
                  <p className="text-[11px] text-white uppercase tracking-wider font-medium">
                    Total
                  </p>
                  <span className="ml-auto bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                    {patient.discount}% off
                  </span>
                </div>
                <div className="bg-white px-4 py-3 flex items-center justify-between gap-2">
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                      Before
                    </span>
                    <span className="text-lg font-black text-gray-400 line-through">
                      {base} EGP
                    </span>
                  </div>
                  <div className="w-px h-10 bg-gray-100" />
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] text-green-500 uppercase tracking-wider mb-1">
                      After
                    </span>
                    <span className="text-2xl font-black text-green-700">
                      {after} EGP
                    </span>
                  </div>
                  <div className="w-px h-10 bg-gray-100" />
                  <div className="flex flex-col items-center flex-1">
                    <span className="text-[10px] text-gray-400 uppercase tracking-wider mb-1">
                      Saving
                    </span>
                    <span
                      className="text-lg font-black"
                      style={{ color: BLUE }}
                    >
                      {base - after} EGP
                    </span>
                  </div>
                </div>
              </div>

              {patient.notes && (
                <div className="flex gap-2 items-start bg-amber-50 border border-amber-200 rounded-xl px-3 py-2.5">
                  <MdInfo
                    size={14}
                    className="text-amber-500 shrink-0 mt-0.5"
                  />
                  <p className="text-xs text-amber-800 leading-relaxed">
                    {patient.notes}
                  </p>
                </div>
              )}
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
function PatientCard({ patient, index, onConfirm }) {
  const isReceived = patient.status === "received";
  const base = totalBefore(patient.tests);
  const after = afterPct(base, patient.discount);
  const [firstName, ...rest] = patient.name.split(" ");
  const lastName = rest.join(" ");

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ delay: index * 0.05, duration: 0.3 }}
      className={`rounded-2xl border p-3.5 sm:p-4 flex flex-col gap-2.5 sm:gap-3 overflow-hidden transition-shadow
        ${isReceived ? "bg-green-50 border-green-200" : "bg-white border-gray-200 hover:shadow-md"}`}
    >
      {/* top — avatar + name + status */}
      <div className="flex items-start justify-between gap-2">
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

      {/* phone + doctor */}
      <div className="flex flex-col gap-1">
        <div
          className="flex items-center gap-1.5 text-xs font-medium"
          style={{ color: BLUE }}
        >
          <MdPhone size={12} className="shrink-0" />
          <span>{patient.phone}</span>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-gray-500">
          <FaUserDoctor size={11} className="shrink-0 text-gray-400" />
          <span className="font-medium text-gray-700 truncate">
            {patient.doctor.name}
          </span>
          <span className="text-gray-300 hidden sm:block">·</span>
          <span className="text-gray-400 truncate hidden sm:block">
            {patient.doctor.specialization}
          </span>
        </div>
      </div>

      {/* tests with per-test price */}
      <div
        className="rounded-xl overflow-hidden border"
        style={{ borderColor: "#C7D8F9" }}
      >
        <div
          className="px-3 py-1.5 flex items-center gap-1.5"
          style={{ background: BLUE }}
        >
          <MdScience size={12} className="text-white/80 shrink-0" />
          <p className="text-[10px] text-white font-semibold uppercase tracking-wider">
            Tests
          </p>
          <span className="ml-auto bg-white/20 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">
            {patient.tests.length}
          </span>
        </div>
        <div className="bg-white divide-y divide-gray-100">
          {patient.tests.map((t, i) => (
            <div
              key={t.name}
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
                  {t.name}
                </span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="text-[11px] text-gray-400 line-through">
                  {t.price}
                </span>
                <span className="text-xs font-bold text-green-700">
                  {afterPct(t.price, patient.discount)} EGP
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* total pricing row */}
      <div className="flex items-center gap-2 rounded-xl bg-gray-50 border border-gray-200 px-3 py-2">
        <span className="text-xs text-gray-400 line-through shrink-0">
          {base} EGP
        </span>
        <span className="text-gray-300">→</span>
        <span className="text-sm font-black text-green-700 shrink-0">
          {after} EGP
        </span>
        <span
          className="ml-auto text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 text-white"
          style={{ background: BLUE }}
        >
          {patient.discount}% off
        </span>
      </div>

      {/* appointment + notes */}
      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400">
        {patient.appointmentDate && (
          <span className="flex items-center gap-1">
            <MdCalendarToday size={10} />
            {fmt(patient.appointmentDate)}
          </span>
        )}
        {patient.notes && (
          <span className="flex items-center gap-1 text-amber-600 min-w-0">
            <MdInfo size={10} className="shrink-0" />
            <span className="truncate max-w-[160px] sm:max-w-[220px]">
              {patient.notes}
            </span>
          </span>
        )}
      </div>

      {/* action */}
      {!isReceived ? (
        <motion.button
          whileHover={{ y: -1 }}
          whileTap={{ scale: 0.97 }}
          onClick={() => onConfirm(patient)}
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
    </motion.div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function ReferredPatients() {
  const [tab, setTab] = useState("all");
  const [search, setSearch] = useState("");
  const [patients, setPatients] = useState(MOCK_PATIENTS);
  const [confirmPt, setConfirmPt] = useState(null);

  const counts = {
    all: patients.length,
    pending: patients.filter((p) => p.status === "pending").length,
    received: patients.filter((p) => p.status === "received").length,
  };

  const filtered = patients
    .filter((p) => tab === "all" || p.status === tab)
    .filter((p) =>
      `${p.name} ${p.doctor.name} ${p.tests.map((t) => t.name).join(" ")}`
        .toLowerCase()
        .includes(search.toLowerCase()),
    );

  const handleConfirmClose = (result) => {
    if (result === "confirmed")
      setPatients((prev) =>
        prev.map((p) =>
          p._id === confirmPt._id ? { ...p, status: "received" } : p,
        ),
      );
    setConfirmPt(null);
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
              {counts.pending} pending · {counts.received} received
            </p>
          </div>
          <div
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shadow-lg"
            style={{ background: BLUE }}
          >
            <PiFlask size={17} color="#fff" />
          </div>
        </motion.div>

        {/* summary pills */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.06 }}
          className="grid grid-cols-3 gap-2 sm:gap-3"
        >
          {[
            { label: "Total", value: counts.all, bg: BLUE },
            { label: "Pending", value: counts.pending, bg: "#f59e0b" },
            { label: "Received", value: counts.received, bg: "#16a34a" },
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

        {/* tabs */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex gap-1.5 p-1 bg-gray-100 rounded-2xl"
        >
          {TABS.map(({ key, label }) => {
            const isActive = tab === key;
            return (
              <button
                key={key}
                onClick={() => setTab(key)}
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
                <span className="relative flex items-center gap-1">
                  {label}
                  {counts[key] > 0 && (
                    <span
                      className={`inline-flex items-center justify-center min-w-[16px] h-4 px-1 rounded-full text-[10px] font-bold
                      ${isActive ? "text-white" : "bg-gray-200 text-gray-600"}`}
                      style={isActive ? { background: BLUE } : {}}
                    >
                      {counts[key]}
                    </span>
                  )}
                </span>
              </button>
            );
          })}
        </motion.div>

        {/* search */}
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="relative"
        >
          <MdSearch
            size={16}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by patient name, doctor or test…"
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

        {/* grid */}
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
                  <MdPerson size={20} className="text-gray-400" />
                </div>
                <p className="text-sm font-medium text-gray-400">
                  No patients found
                </p>
              </motion.div>
            ) : (
              filtered.map((pt, i) => (
                <PatientCard
                  key={pt._id}
                  patient={pt}
                  index={i}
                  onConfirm={setConfirmPt}
                />
              ))
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {confirmPt && (
          <ConfirmModal patient={confirmPt} onClose={handleConfirmClose} />
        )}
      </AnimatePresence>
    </>
  );
}
