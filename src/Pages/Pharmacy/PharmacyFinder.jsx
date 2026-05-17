import { useState, useEffect } from "react";
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
} from "react-icons/fi";
import { RiMedicineBottleLine } from "react-icons/ri";
import { MdOutlineLocalPharmacy } from "react-icons/md";

// ── Mock Data ──────────────────────────────────────────────────────────────
const MOCK_PRESCRIPTION = {
  id: "RX-2024-00847",
  doctor: "Dr. Ahmed Hassan",
  date: "May 10, 2026",
  medications: [
    { name: "Amoxicillin 500mg", qty: "21 Capsules" },
    { name: "Ibuprofen 400mg", qty: "30 Tablets" },
    { name: "Omeprazole 20mg", qty: "14 Capsules" },
  ],
};

const MOCK_PHARMACIES = [
  {
    id: 1,
    name: "Cairo Central Pharmacy",
    distance: "0.3 km",
    rating: 4.9,
    phone: "+20 2 2345 6789",
    address: "12 Tahrir Square, Cairo",
    hours: "Open 24 hrs",
    available: 3,
  },
  {
    id: 2,
    name: "Al Nile MedStore",
    distance: "0.7 km",
    rating: 4.7,
    phone: "+20 2 3456 7890",
    address: "45 Nile Corniche, Cairo",
    hours: "8am – 11pm",
    available: 3,
  },
  {
    id: 3,
    name: "HealthPlus Pharmacy",
    distance: "1.1 km",
    rating: 4.6,
    phone: "+20 2 4567 8901",
    address: "78 Ramses Ave, Cairo",
    hours: "7am – 12am",
    available: 2,
  },
  {
    id: 4,
    name: "MediCare Express",
    distance: "1.4 km",
    rating: 4.5,
    phone: "+20 2 5678 9012",
    address: "22 October Bridge Rd",
    hours: "Open 24 hrs",
    available: 3,
  },
  {
    id: 5,
    name: "Pharma City Center",
    distance: "1.8 km",
    rating: 4.4,
    phone: "+20 2 6789 0123",
    address: "9 El Moez St, Cairo",
    hours: "9am – 10pm",
    available: 1,
  },
  {
    id: 6,
    name: "Green Cross Pharmacy",
    distance: "2.1 km",
    rating: 4.3,
    phone: "+20 2 7890 1234",
    address: "33 Salah Salem Rd",
    hours: "8am – 11pm",
    available: 2,
  },
  {
    id: 7,
    name: "Al Shifa MedPoint",
    distance: "2.5 km",
    rating: 4.2,
    phone: "+20 2 8901 2345",
    address: "67 Nasr City, Cairo",
    hours: "Open 24 hrs",
    available: 3,
  },
  {
    id: 8,
    name: "Royal Pharmacy",
    distance: "2.8 km",
    rating: 4.1,
    phone: "+20 2 9012 3456",
    address: "14 Mohandessin, Giza",
    hours: "8am – 12am",
    available: 2,
  },
  {
    id: 9,
    name: "QuickMed Pharmacy",
    distance: "3.2 km",
    rating: 4.0,
    phone: "+20 2 0123 4567",
    address: "28 Heliopolis, Cairo",
    hours: "7am – 11pm",
    available: 1,
  },
  {
    id: 10,
    name: "Sunrise Pharma",
    distance: "3.6 km",
    rating: 3.9,
    phone: "+20 2 1234 5679",
    address: "51 6th October, Giza",
    hours: "8am – 10pm",
    available: 2,
  },
];

const SEARCH_STEPS = [
  "Detecting your location...",
  "Scanning nearby pharmacies...",
  "Checking medication stock...",
  "Sorting by availability...",
  "Results ready!",
];

// ── Animated Search Ring ───────────────────────────────────────────────────
function SearchAnimation({ step }) {
  return (
    <div className="flex flex-col items-center justify-center gap-10 py-16">
      {/* Rings */}
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

        {/* Orbiting dot */}
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

      {/* Step text */}
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
            {SEARCH_STEPS[step]}
          </motion.p>
        </AnimatePresence>
      </div>

      {/* Progress dots */}
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

// ── Pharmacy Card ──────────────────────────────────────────────────────────
function PharmacyCard({ pharmacy, index, medications }) {
  const [expanded, setExpanded] = useState(false);
  const allAvail = pharmacy.available === medications.length;
  const partAvail =
    pharmacy.available > 0 && pharmacy.available < medications.length;

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: index * 0.07, ease: "easeOut" }}
      className="bg-white rounded-2xl shadow-md border border-blue-50 overflow-hidden hover:shadow-xl transition-shadow duration-300"
    >
      {/* Top stripe */}
      <div
        className={`h-1.5 ${allAvail ? "bg-gradient-to-r from-blue-500 to-blue-400" : partAvail ? "bg-gradient-to-r from-yellow-400 to-yellow-300" : "bg-gray-200"}`}
      />

      <div className="p-5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3">
            {/* Rank badge */}
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
                <FiMapPin className="text-blue-400" /> {pharmacy.address}
              </p>
            </div>
          </div>

          {/* Availability badge */}
          <span
            className={`shrink-0 text-xs font-semibold px-3 py-1 rounded-full ${allAvail ? "bg-blue-50 text-blue-700" : partAvail ? "bg-yellow-50 text-yellow-700" : "bg-red-50 text-red-500"}`}
          >
            {allAvail
              ? "All Available"
              : partAvail
                ? `${pharmacy.available}/${medications.length} Meds`
                : "Out of Stock"}
          </span>
        </div>

        {/* Stats row */}
        <div className="mt-4 flex flex-wrap gap-3">
          <Chip
            icon={<FiNavigation className="text-blue-500" />}
            text={pharmacy.distance}
          />
          <Chip
            icon={<FiStar className="text-yellow-400" />}
            text={pharmacy.rating.toFixed(1)}
          />
          <Chip
            icon={<FiClock className="text-blue-400" />}
            text={pharmacy.hours}
          />
          <Chip
            icon={<FiPhone className="text-blue-400" />}
            text={pharmacy.phone}
          />
        </div>

        {/* Expand meds */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-4 w-full flex items-center justify-between text-xs text-blue-600 font-semibold hover:text-blue-800 transition-colors"
        >
          <span className="flex items-center gap-1.5">
            <FiPackage /> Medication availability
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
                {medications.map((med, i) => {
                  const avail = i < pharmacy.available;
                  return (
                    <div
                      key={i}
                      className="flex items-center justify-between text-sm bg-blue-50/50 rounded-xl px-4 py-2.5"
                    >
                      <div className="flex items-center gap-2">
                        <RiMedicineBottleLine className="text-blue-400" />
                        <span className="text-gray-700 font-medium">
                          {med.name}
                        </span>
                      </div>
                      {avail ? (
                        <span className="flex items-center gap-1 text-blue-600 font-semibold text-xs">
                          <FiCheckCircle /> In Stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-red-400 text-xs">
                          <FiAlertCircle /> Unavailable
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Get directions CTA */}
      <div className="px-5 pb-5">
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-2 w-full py-2.5 rounded-xl bg-blue-600 text-white font-semibold text-sm flex items-center justify-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <FiNavigation /> Get Directions
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

// ── Main Page ──────────────────────────────────────────────────────────────
export default function PharmacyFinderPage() {
  const [phase, setPhase] = useState("idle"); // idle | searching | results
  const [searchStep, setSearchStep] = useState(0);

  const prescription = MOCK_PRESCRIPTION;

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
        );
        const data = await res.json();

        const address = {
          Street: data.address.road,
          BuildingNo: data.address.house_number ?? "1",
          City: data.address.city || data.address.town,
          Governorate: data.address.state,
          Country: data.address.country,
        };

        console.log("User Address:", address);
      },
      (error) => {
        console.error("Location error:", error.message);
      },
    );
  }, []);

  function startSearch() {
    setPhase("searching");
    setSearchStep(0);
    let s = 0;
    const interval = setInterval(() => {
      s++;
      if (s >= SEARCH_STEPS.length - 1) {
        clearInterval(interval);
        setTimeout(() => setPhase("results"), 600);
      }
      setSearchStep(s);
    }, 900);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br pt-[40px] from-blue-50 via-white to-blue-100 font-sans">
      <main className="max-w-3xl mx-auto px-4 py-8 space-y-6">
        {/* Prescription Card */}
        <motion.div
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-2xl shadow-md border border-blue-100 p-6"
        >
          <div className="flex items-center gap-3 mb-5">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <RiMedicineBottleLine className="text-white text-xl" />
            </div>
            <div>
              <h2 className="font-bold text-gray-900">
                Prescription {prescription.id}
              </h2>
              <p className="text-gray-400 text-xs">
                {prescription.doctor} · {prescription.date}
              </p>
            </div>
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
              onClick={startSearch}
              className="w-full py-3.5 rounded-2xl bg-blue-600 text-white font-bold text-base flex items-center justify-center gap-2.5 hover:bg-blue-700 shadow-lg shadow-blue-200 transition-colors"
            >
              <FiSearch className="text-lg" />
              Find Nearby Pharmacies
            </motion.button>
          )}

          {phase !== "idle" && (
            <div className="w-full py-2.5 rounded-2xl bg-blue-50 text-blue-500 font-semibold text-sm flex items-center justify-center gap-2">
              <FiCheckCircle /> Search initiated
            </div>
          )}
        </motion.div>

        {/* Search Animation */}
        <AnimatePresence>
          {phase === "searching" && (
            <motion.div
              key="search-anim"
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
          {phase === "results" && (
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
                    10 Pharmacies Found
                  </h2>
                  <p className="text-gray-400 text-sm">
                    Sorted by distance · All stock verified
                  </p>
                </div>
                <div className="bg-blue-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                  Near you
                </div>
              </motion.div>

              {/* Cards */}
              <div className="space-y-4">
                {MOCK_PHARMACIES.map((pharmacy, i) => (
                  <PharmacyCard
                    key={pharmacy.id}
                    pharmacy={pharmacy}
                    index={i}
                    medications={prescription.medications}
                  />
                ))}
              </div>

              {/* Footer note */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1.2 }}
                className="text-center text-gray-400 text-xs mt-8 pb-6"
              >
                Stock availability is updated in real-time. Results may vary.
              </motion.p>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
