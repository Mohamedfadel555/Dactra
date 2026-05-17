import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMapPin,
  FiPhone,
  FiClock,
  FiCheckCircle,
  FiSearch,
  FiAlertCircle,
  FiStar,
  FiNavigation,
  FiPackage,
  FiArrowLeft,
  FiFileText,
  FiChevronRight,
  FiWifiOff,
  FiTruck,
} from "react-icons/fi";
import { RiMedicineBottleLine } from "react-icons/ri";
import { GiMedicines } from "react-icons/gi";
import { FaUserMd, FaCalendarAlt } from "react-icons/fa";
import { useLocation, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../hooks/useAxios";
import { useNearbyPharmacies } from "../../hooks/useNearbyPharmacies";

// ── Prescription Selector ──────────────────────────────────────────────────
function PrescriptionSelector({ onSelect }) {
  const axiosInstance = useAxios();
  const [selectedId, setSelectedId] = useState(null);

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["my-prescriptions"],
    queryFn: async () => {
      const res = await axiosInstance.get("Prescriptions/my-prescriptions");
      return res.data;
    },
  });

  function buildPrescriptionData(rx) {
    return {
      id: rx.id,
      doctor: `Dr. ${rx.doctor.fullName}`,
      date: rx.createdAt?.split("T")[0],
      diagnosis: rx.diagnosis,
      medications: rx.medicines.map((med) => ({
        name: med.dose ? `${med.name} ${med.dose}mg` : med.name,
        qty: med.durationDisplay ?? "",
      })),
    };
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-md border border-blue-100 overflow-hidden"
    >
      <div className="px-6 pt-6 pb-4 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shrink-0">
            <FiFileText className="text-white text-lg" />
          </div>
          <div>
            <h2 className="font-bold text-gray-900 text-[16px]">
              Select a Prescription
            </h2>
            <p className="text-gray-400 text-xs mt-0.5">
              Choose which prescription to search pharmacies for
            </p>
          </div>
        </div>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="h-[76px] rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <GiMedicines className="text-blue-300 text-2xl" />
            </div>
            <p className="text-[13px] text-gray-400 text-center">
              No prescriptions found.
            </p>
          </div>
        ) : (
          <motion.div
            className="flex flex-col gap-2"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            initial="hidden"
            animate="show"
          >
            {prescriptions.map((rx) => {
              const isSelected = selectedId === rx.id;
              const date = rx.createdAt?.split("T")[0];
              return (
                <motion.button
                  key={rx.id}
                  variants={{
                    hidden: { opacity: 0, y: 10 },
                    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
                  }}
                  onClick={() => setSelectedId(rx.id)}
                  className={`w-full text-left rounded-xl border px-4 py-3.5 transition-all duration-200
                    ${
                      isSelected
                        ? "border-blue-500 bg-blue-50 shadow-sm shadow-blue-100"
                        : "border-gray-100 bg-white hover:border-blue-200 hover:bg-gray-50/60"
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors
                      ${isSelected ? "bg-blue-600" : "bg-blue-50"}`}
                    >
                      <GiMedicines
                        className={`text-[15px] ${isSelected ? "text-white" : "text-blue-500"}`}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-[13px] font-semibold text-gray-900 capitalize truncate">
                        {rx.diagnosis}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <FaUserMd className="text-[10px]" /> Dr.{" "}
                          {rx.doctor.fullName}
                        </span>
                        <span className="flex items-center gap-1 text-[11px] text-gray-400">
                          <FaCalendarAlt className="text-[10px]" /> {date}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full transition-colors
                        ${isSelected ? "bg-blue-600 text-white" : "bg-blue-50 text-blue-600"}`}
                      >
                        {rx.medicines.length} med
                        {rx.medicines.length !== 1 ? "s" : ""}
                      </span>
                      <FiChevronRight
                        className={`text-[13px] transition-colors ${isSelected ? "text-blue-500" : "text-gray-300"}`}
                      />
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </div>

      <div className="px-4 pb-5">
        <motion.button
          whileHover={{ scale: selectedId ? 1.02 : 1 }}
          whileTap={{ scale: selectedId ? 0.97 : 1 }}
          disabled={!selectedId}
          onClick={() => {
            const rx = prescriptions.find((r) => r.id === selectedId);
            if (rx) onSelect(buildPrescriptionData(rx));
          }}
          className={`w-full py-3.5 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-200
            ${
              selectedId
                ? "bg-blue-600 hover:bg-blue-700 text-white shadow-md shadow-blue-100"
                : "bg-gray-100 text-gray-300 cursor-not-allowed"
            }`}
        >
          <FiSearch className="text-[15px]" />
          Find Nearby Pharmacies
        </motion.button>
      </div>
    </motion.div>
  );
}

// ── Search Animation ───────────────────────────────────────────────────────
const SEARCH_STEPS = [
  "Detecting your location...",
  "Scanning nearby pharmacies...",
  "Checking medication stock...",
  "Sorting by availability...",
  "Results ready!",
];

function SearchAnimation({ step }) {
  return (
    <div className="flex flex-col items-center justify-center gap-10 py-16">
      <div className="relative w-48 h-48 flex items-center justify-center">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="absolute rounded-full border-2 border-blue-400"
            style={{ width: `${100 + i * 40}px`, height: `${100 + i * 40}px` }}
            animate={{ scale: [1, 1.08, 1], opacity: [0.6, 0.2, 0.6] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.4,
              ease: "easeInOut",
            }}
          />
        ))}
        <motion.div
          className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-2xl shadow-blue-300"
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "easeInOut" }}
        >
          <FiSearch className="text-white text-3xl" />
        </motion.div>
        <motion.div
          className="absolute w-4 h-4 rounded-full bg-blue-500"
          style={{
            top: "50%",
            left: "50%",
            marginTop: -8,
            marginLeft: -8,
            transformOrigin: "8px 72px",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
        />
      </div>
      <div className="h-8 flex items-center">
        <AnimatePresence mode="wait">
          <motion.p
            key={step}
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.35 }}
            className="text-blue-700 font-semibold text-lg tracking-wide"
          >
            {SEARCH_STEPS[Math.min(step, SEARCH_STEPS.length - 1)]}
          </motion.p>
        </AnimatePresence>
      </div>
      <div className="flex gap-3">
        {SEARCH_STEPS.map((_, i) => (
          <motion.div
            key={i}
            className="h-2 rounded-full bg-blue-200"
            animate={{
              width: i <= step ? 28 : 8,
              backgroundColor: i <= step ? "#2563eb" : "#bfdbfe",
            }}
            transition={{ duration: 0.4 }}
          />
        ))}
      </div>
    </div>
  );
}

// ── Stock helpers ──────────────────────────────────────────────────────────
function getStockBadge(qty) {
  if (qty > 50)
    return {
      label: "In Stock",
      className: "bg-green-50 text-green-700 border border-green-100",
    };
  if (qty > 10)
    return {
      label: "Low Stock",
      className: "bg-yellow-50 text-yellow-700 border border-yellow-100",
    };
  return {
    label: "Last Units",
    className: "bg-red-50 text-red-500 border border-red-100",
  };
}

// ── Pharmacy Card ──────────────────────────────────────────────────────────
function PharmacyCard({ pharmacy, index, isNearest }) {
  const [expanded, setExpanded] = useState(false);

  const match = Math.round(pharmacy.matchPercentage);
  const dist = pharmacy.distanceKm.toFixed(1);
  const eta = Math.round(pharmacy.estimatedDurationMinutes);
  const fee = Math.round(pharmacy.deliveryFee);
  const allAvail = pharmacy.notFoundMedicines.length === 0;
  const partAvail =
    pharmacy.matchedDrugs > 0 && pharmacy.notFoundMedicines.length > 0;

  const barColor = allAvail
    ? "from-green-400 to-green-300"
    : partAvail
      ? "from-yellow-400 to-yellow-300"
      : "from-red-400 to-red-300";

  const matchColor = allAvail
    ? "text-green-600"
    : partAvail
      ? "text-yellow-600"
      : "text-red-500";

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
      className={`bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300
        ${isNearest ? "border-2 border-blue-500" : "border border-blue-50"}`}
    >
      {/* match progress bar */}
      <div
        className={`h-1 bg-gradient-to-r ${barColor}`}
        style={{ width: `${match}%` }}
      />

      <div className="p-5">
        {/* nearest badge */}
        {isNearest && (
          <div className="inline-flex items-center gap-1.5 bg-blue-50 border border-blue-200 rounded-full px-3 py-1 mb-3">
            <FiStar className="text-blue-500 text-[11px]" />
            <span className="text-[11px] font-semibold text-blue-600">
              Closest to you
            </span>
          </div>
        )}

        {/* header */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-start gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 flex items-center justify-center shrink-0 mt-0.5">
              <span className="text-blue-700 font-bold text-sm">
                #{index + 1}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-base leading-tight">
                {pharmacy.name}
              </h3>
              <p className="text-gray-400 text-xs mt-0.5 flex items-center gap-1">
                <FiMapPin className="text-blue-400" />
                {dist} km · {eta} min away
              </p>
            </div>
          </div>
          <div className="text-center shrink-0">
            <p className={`text-lg font-bold ${matchColor}`}>{match}%</p>
            <p className="text-[10px] text-gray-400">match</p>
          </div>
        </div>

        {/* chips */}
        <div className="flex flex-wrap gap-2 mb-4">
          <Chip
            icon={<FiPhone className="text-blue-400" />}
            text={pharmacy.contactNumber}
          />
          <Chip
            icon={<FiTruck className="text-blue-400" />}
            text={`Delivery EGP ${fee}`}
          />
          <Chip
            icon={<FiPackage className="text-blue-400" />}
            text={`${pharmacy.matchedDrugs}/${pharmacy.totalRequestedDrugs} med${pharmacy.totalRequestedDrugs !== 1 ? "s" : ""}`}
          />
        </div>

        {/* expand toggle */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full flex items-center justify-between text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors border-t border-gray-100 pt-3"
        >
          <span className="flex items-center gap-1.5">
            <FiPackage /> Medication details
          </span>
          <motion.span
            animate={{ rotate: expanded ? 180 : 0 }}
            transition={{ duration: 0.25 }}
          >
            ▼
          </motion.span>
        </button>

        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 space-y-2">
                {/* found medicines */}
                {pharmacy.foundMedicines.map((med, i) => {
                  const badge = getStockBadge(med.availableQuantity);
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between bg-blue-50/50 rounded-xl px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <RiMedicineBottleLine className="text-blue-400 shrink-0" />
                        <div className="min-w-0">
                          <p className="text-gray-700 font-medium text-sm truncate">
                            {med.medicineName}
                          </p>
                          <p className="text-gray-400 text-[11px]">
                            Qty: {med.availableQuantity}
                          </p>
                        </div>
                      </div>
                      <span
                        className={`shrink-0 text-[11px] font-semibold px-2 py-0.5 rounded-full ml-2 ${badge.className}`}
                      >
                        {badge.label}
                      </span>
                    </div>
                  );
                })}

                {/* not found medicines */}
                {pharmacy.notFoundMedicines.map((med, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between bg-red-50 rounded-xl px-4 py-2.5 border border-red-100"
                  >
                    <div className="flex items-center gap-2">
                      <RiMedicineBottleLine className="text-red-400 shrink-0" />
                      <span className="text-gray-700 font-medium text-sm">
                        {med.medicineName ?? med}
                      </span>
                    </div>
                    <span className="flex items-center gap-1 text-red-400 text-xs font-semibold">
                      <FiAlertCircle /> Unavailable
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* actions */}
      <div className="px-5 pb-5 grid grid-cols-2 gap-2">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => {
            window.open(
              `https://www.google.com/maps/search/?api=1&query=${pharmacy.latitude},${pharmacy.longitude}`,
              "_blank",
            );
          }}
          className="py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FiNavigation /> Directions
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => window.open(`tel:${pharmacy.contactNumber}`)}
          className="py-2.5 rounded-xl bg-gray-50 border border-gray-200 text-gray-700 font-semibold text-sm flex items-center justify-center gap-2 hover:bg-gray-100 transition-colors"
        >
          <FiPhone /> Call
        </motion.button>
      </div>
    </motion.div>
  );
}

function Chip({ icon, text }) {
  return (
    <span className="flex items-center gap-1.5 text-xs text-gray-500 bg-gray-50 border border-gray-100 px-2.5 py-1 rounded-lg">
      {icon}
      {text}
    </span>
  );
}

// ── Stat Chip ──────────────────────────────────────────────────────────────
function StatCard({ icon, label, value }) {
  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-3">
      <div className="flex items-center gap-1.5 mb-1">
        {icon}
        <span className="text-[11px] text-gray-400">{label}</span>
      </div>
      <p className="text-base font-bold text-gray-800">{value}</p>
    </div>
  );
}

// ── Main Page ──────────────────────────────────────────────────────────────
export default function PharmacyFinderPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [prescription, setPrescription] = useState(
    location.state?.prescription ?? null,
  );
  const [userAddress, setUserAddress] = useState(null);
  const [locationError, setLocationError] = useState(false);
  const [searchStep, setSearchStep] = useState(0);
  const searchStepRef = useRef(null);

  const {
    mutate: findPharmacies,
    data: pharmacies,
    isPending,
    isError,
    isSuccess,
    reset: resetSearch,
  } = useNearbyPharmacies();

  // Fetch user location on mount
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await res.json();
          setUserAddress({
            street: data.address.road ?? "",
            city: data.address.city ?? data.address.town ?? "",
            BuildingNo: data.address.house_number ?? "1",
            country: data.address.country ?? "",
            governorate: data.address.state ?? "",
          });
        } catch {
          setLocationError(true);
        }
      },
      () => setLocationError(true),
    );
  }, []);

  // Step animation during search
  useEffect(() => {
    if (isPending) {
      setSearchStep(0);
      let s = 0;
      searchStepRef.current = setInterval(() => {
        s = Math.min(s + 1, SEARCH_STEPS.length - 2);
        setSearchStep(s);
      }, 900);
    } else {
      clearInterval(searchStepRef.current);
      if (isSuccess) setSearchStep(SEARCH_STEPS.length - 1);
    }
    return () => clearInterval(searchStepRef.current);
  }, [isPending, isSuccess]);

  function handleSearch() {
    if (!prescription) return;
    findPharmacies({
      prescriptionId: prescription.id,
      street: userAddress?.street ?? "",
      city: userAddress?.city ?? "",
      BuildingNo: userAddress?.BuildingNo ?? "1",
      country: userAddress?.country ?? "",
      governorate: userAddress?.governorate ?? "",
    });
  }

  function handlePrescriptionSelected(rx) {
    setPrescription(rx);
    resetSearch();
    setSearchStep(0);
  }

  const phase = isPending ? "searching" : isSuccess ? "results" : "idle";

  // Summary stats derived from API response
  const minDist =
    Array.isArray(pharmacies) && pharmacies.length > 0
      ? Math.min(...pharmacies.map((p) => p.distanceKm)).toFixed(1)
      : null;
  const minFee =
    Array.isArray(pharmacies) && pharmacies.length > 0
      ? Math.min(...pharmacies.map((p) => p.deliveryFee)).toFixed(0)
      : null;
  const minEta =
    Array.isArray(pharmacies) && pharmacies.length > 0
      ? Math.round(
          Math.min(...pharmacies.map((p) => p.estimatedDurationMinutes)),
        )
      : null;

  return (
    <div className="min-h-screen bg-gradient-to-br pt-[40px] from-blue-50 via-white to-blue-100 font-sans">
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Back */}
        <motion.button
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-[13px] text-gray-500 hover:text-blue-600 transition-colors font-medium"
        >
          <FiArrowLeft /> Back
        </motion.button>

        {/* Location warning */}
        {locationError && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 text-[12px] text-amber-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-2.5"
          >
            <FiWifiOff className="shrink-0" />
            Location unavailable — pharmacy search may be less accurate.
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {/* ── Selector ── */}
          {!prescription ? (
            <motion.div
              key="selector"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
            >
              <PrescriptionSelector onSelect={handlePrescriptionSelected} />
            </motion.div>
          ) : (
            /* ── Finder ── */
            <motion.div
              key="finder"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              transition={{ duration: 0.35 }}
              className="space-y-6"
            >
              {/* Prescription card */}
              <div className="bg-white rounded-2xl shadow-md border border-blue-100 p-6">
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
                    <RiMedicineBottleLine className="text-white text-xl" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="font-bold text-gray-900 capitalize truncate">
                      {prescription.diagnosis ||
                        `Prescription ${prescription.id}`}
                    </h2>
                    <p className="text-gray-400 text-xs">
                      {prescription.doctor}
                      {prescription.date ? ` · ${prescription.date}` : ""}
                    </p>
                  </div>
                  {!location.state?.prescription && phase === "idle" && (
                    <button
                      onClick={() => {
                        setPrescription(null);
                        resetSearch();
                      }}
                      className="shrink-0 text-[11px] text-blue-500 hover:text-blue-700 font-semibold border border-blue-200 px-3 py-1.5 rounded-lg transition-colors"
                    >
                      Change
                    </button>
                  )}
                </div>

                <div className="space-y-2.5 mb-6">
                  {prescription.medications.map((m, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 + i * 0.08 }}
                      className="flex items-center justify-between bg-blue-50 rounded-xl px-4 py-3"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-2 h-2 rounded-full bg-blue-500" />
                        <span className="text-gray-800 font-medium text-sm">
                          {m.name}
                        </span>
                      </div>
                      <span className="text-blue-500 text-xs font-semibold">
                        {m.qty}
                      </span>
                    </motion.div>
                  ))}
                </div>

                {phase === "idle" && (
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.96 }}
                    onClick={handleSearch}
                    className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-base flex items-center justify-center gap-2.5 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
                  >
                    <FiSearch className="text-lg" /> Find Nearby Pharmacies
                  </motion.button>
                )}

                {isError && (
                  <div className="space-y-3">
                    <p className="text-center text-[12px] text-red-400 bg-red-50 rounded-xl py-2.5 px-4">
                      Something went wrong. Please try again.
                    </p>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.96 }}
                      onClick={handleSearch}
                      className="w-full py-3 rounded-2xl bg-blue-600 text-white font-bold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
                    >
                      <FiSearch /> Retry
                    </motion.button>
                  </div>
                )}

                {phase !== "idle" && !isError && (
                  <div className="w-full py-2.5 rounded-2xl bg-blue-50 text-blue-500 font-semibold text-sm flex items-center justify-center gap-2">
                    <FiCheckCircle /> Search initiated
                  </div>
                )}
              </div>

              {/* Search animation */}
              <AnimatePresence>
                {phase === "searching" && (
                  <motion.div
                    key="anim"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.4 }}
                    className="bg-white rounded-2xl shadow-md border border-blue-100"
                  >
                    <SearchAnimation step={searchStep} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Results */}
              <AnimatePresence>
                {phase === "results" && Array.isArray(pharmacies) && (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.4 }}
                  >
                    {/* Results header */}
                    <motion.div
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="flex items-center justify-between mb-4"
                    >
                      <div>
                        <h2 className="text-blue-900 font-bold text-xl">
                          {pharmacies.length} Pharmac
                          {pharmacies.length === 1 ? "y" : "ies"} Found
                        </h2>
                        <p className="text-gray-400 text-sm">
                          Sorted by distance · Stock verified
                        </p>
                      </div>
                      <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                        Near you
                      </div>
                    </motion.div>

                    {/* Summary stat cards */}
                    {pharmacies.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.15 }}
                        className="grid grid-cols-3 gap-3 mb-5"
                      >
                        <StatCard
                          icon={<FiMapPin className="text-blue-400 text-xs" />}
                          label="Closest"
                          value={`${minDist} km`}
                        />
                        <StatCard
                          icon={<FiClock className="text-blue-400 text-xs" />}
                          label="Fastest ETA"
                          value={`${minEta} min`}
                        />
                        <StatCard
                          icon={<FiTruck className="text-blue-400 text-xs" />}
                          label="Min. delivery"
                          value={`EGP ${minFee}`}
                        />
                      </motion.div>
                    )}

                    {pharmacies.length === 0 ? (
                      <div className="bg-white rounded-2xl border border-gray-100 flex flex-col items-center justify-center py-14 gap-3">
                        <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
                          <GiMedicines className="text-blue-300 text-2xl" />
                        </div>
                        <p className="text-[13px] text-gray-400">
                          No pharmacies found nearby.
                        </p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {pharmacies.map((pharmacy, i) => (
                          <PharmacyCard
                            key={pharmacy.pharmacyId ?? i}
                            pharmacy={pharmacy}
                            index={i}
                            isNearest={i === 0}
                          />
                        ))}
                      </div>
                    )}

                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-center text-gray-400 text-xs mt-8 pb-6"
                    >
                      Availability is updated in real-time · Results may vary
                    </motion.p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
