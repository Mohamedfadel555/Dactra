import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GiMedicines } from "react-icons/gi";
import { IoCloseSharp, IoChevronDownSharp } from "react-icons/io5";
import { FaUserMd, FaCalendarAlt, FaClock } from "react-icons/fa";
import { FiSearch } from "react-icons/fi";
import { useQuery } from "@tanstack/react-query";
import { useAxios } from "../../hooks/useAxios";
import { useNavigate } from "react-router-dom";

function utcTimeToLocal(utcTime) {
  if (!utcTime) return "";
  const [h, m] = utcTime.split(":").map(Number);
  const d = new Date();
  d.setUTCHours(h, m, 0, 0);
  return d.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── animation variants ───────────────────────────────────────────────────────

const popupVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 20 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 120, damping: 22, mass: 0.9 },
  },
  exit: { opacity: 0, scale: 0.92, y: 20, transition: { duration: 0.2 } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25 } },
  exit: { opacity: 0, transition: { duration: 0.2 } },
};

const itemFade = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" } },
};

// ─── when-to-take color helper ────────────────────────────────────────────────

const whenColors = {
  "Before Meals": "bg-amber-50 text-amber-700 border-amber-200",
  "After Meals": "bg-green-50 text-green-700 border-green-200",
  "Any Time": "bg-blue-50 text-blue-700 border-blue-200",
  "With Meals": "bg-purple-50 text-purple-700 border-purple-200",
};

function WhenBadge({ label }) {
  const cls = whenColors[label] ?? "bg-gray-50 text-gray-600 border-gray-200";
  return (
    <span
      className={`text-[11px] font-medium px-2 py-0.5 rounded-full border ${cls}`}
    >
      {label}
    </span>
  );
}

// ─── medicine row ─────────────────────────────────────────────────────────────

function MedicineRow({ med }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border border-gray-100 rounded-xl overflow-hidden">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
      >
        <div className="size-8 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
          <GiMedicines className="text-blue-600 text-[16px]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-gray-900 truncate">
            {med.name}
          </p>
          <p className="text-[11px] text-gray-400">
            {med.dose && `${med.dose}mg · `}
            {med.timesPerDayDisplay} · {med.durationDisplay} · first dose{" "}
            {utcTimeToLocal(med.firstDoseTime)}
          </p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <WhenBadge label={med.whenToTakeDisplay} />
          <IoChevronDownSharp
            className={`text-gray-400 text-[14px] transition-transform duration-200 ${open ? "rotate-180" : ""}`}
          />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 pt-1 border-t border-gray-100 bg-gray-50/50">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">
                Dose schedule
              </p>
              <div className="flex flex-wrap gap-2">
                {med.doseTimes.map((d) => (
                  <div
                    key={d.doseOrder}
                    className="flex items-center gap-1.5 bg-white border border-gray-100 rounded-lg px-2.5 py-1.5"
                  >
                    <FaClock className="text-gray-400 text-[10px]" />
                    <span className="text-[12px] font-medium text-gray-700">
                      {utcTimeToLocal(d.doseTime)}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      Dose {d.doseOrder}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── prescription card ────────────────────────────────────────────────────────

function PrescriptionCard({ rx, onClick }) {
  const date = rx.createdAt?.split("T")[0];
  return (
    <motion.button
      variants={itemFade}
      whileHover={{ y: -2 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 300, damping: 18 }}
      onClick={onClick}
      className="w-full text-left bg-white border border-gray-100 rounded-xl p-4 hover:border-blue-200 hover:shadow-sm transition-all"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[14px] font-semibold text-gray-900 capitalize">
            {rx.diagnosis}
          </p>
          <p className="text-[12px] text-gray-400 flex items-center gap-1.5 mt-1">
            <FaUserMd className="text-[11px]" />
            Dr. {rx.doctor.fullName}
          </p>
        </div>
        <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
          <span className="flex items-center gap-1 text-[11px] text-gray-400">
            <FaCalendarAlt className="text-[10px]" />
            {date}
          </span>
          <span className="text-[11px] font-medium bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full">
            {rx.medicines.length} med{rx.medicines.length !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </motion.button>
  );
}

// ─── detail modal ─────────────────────────────────────────────────────────────

function PrescriptionModal({ rx, onClose }) {
  const navigate = useNavigate();
  const date = rx.createdAt?.split("T")[0];

  // بناء بيانات الروشتة عشان نبعتها للـ pharmacy finder
  function handleFindPharmacy() {
    const prescriptionData = {
      id: rx.id,
      doctor: `Dr. ${rx.doctor.fullName}`,
      date: date,
      diagnosis: rx.diagnosis,
      medications: rx.medicines.map((med) => ({
        name: med.dose ? `${med.name} ${med.dose}mg` : med.name,
        qty: med.durationDisplay ?? "",
      })),
    };

    navigate("/pharmacyfinder", { state: { prescription: prescriptionData } });
  }

  return (
    <AnimatePresence>
      <>
        <motion.div
          className="w-full h-screen fixed top-0 left-0 z-50 bg-black/55 flex justify-center items-center"
          variants={overlayVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={onClose}
        />
        <motion.div
          className="w-full md:w-[60%] lg:w-2/5 p-6 bg-white flex flex-col gap-5 max-h-[90vh] overflow-auto
                     fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[60] rounded-2xl shadow-xl"
          variants={popupVariants}
          initial="hidden"
          animate="show"
          exit="exit"
          onClick={(e) => e.stopPropagation()}
        >
          <IoCloseSharp
            className="absolute top-4 right-4 text-2xl cursor-pointer text-gray-400 hover:text-gray-700"
            onClick={onClose}
          />

          {/* header */}
          <div>
            <p className="text-[22px] font-bold text-gray-900 capitalize">
              {rx.diagnosis}
            </p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2">
              <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
                <FaUserMd className="text-gray-400" />
                Dr. {rx.doctor.fullName}
              </span>
              <span className="flex items-center gap-1.5 text-[12px] text-gray-500">
                <FaCalendarAlt className="text-gray-400" />
                {date}
              </span>
            </div>
          </div>

          {/* divider */}
          <div className="h-px bg-gray-100" />

          {/* medicines */}
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Medications · {rx.medicines.length}
            </p>
            <div className="flex flex-col gap-2">
              {rx.medicines.map((med) => (
                <MedicineRow key={med.id} med={med} />
              ))}
            </div>
          </div>

          {/* divider */}
          <div className="h-px bg-gray-100" />

          {/* Find Pharmacy Button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleFindPharmacy}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-[14px] flex items-center justify-center gap-2 transition-colors shadow-md shadow-blue-100"
          >
            <FiSearch className="text-[15px]" />
            Find Nearby Pharmacy
          </motion.button>
        </motion.div>
      </>
    </AnimatePresence>
  );
}

// ─── main component ───────────────────────────────────────────────────────────

export default function MyPrescriptions() {
  const axiosInstance = useAxios();
  const [selected, setSelected] = useState(null);

  const { data: prescriptions = [], isLoading } = useQuery({
    queryKey: ["my-prescriptions"],
    queryFn: async () => {
      const res = await axiosInstance.get("Prescriptions/my-prescriptions");
      return res.data;
    },
  });

  return (
    <>
      {selected && (
        <PrescriptionModal rx={selected} onClose={() => setSelected(null)} />
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
        <div className="flex items-center gap-2 mb-4">
          <GiMedicines className="text-blue-600 text-[18px]" />
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
            My Prescriptions
          </p>
        </div>

        {isLoading ? (
          <div className="flex flex-col gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="h-[72px] rounded-xl bg-gray-100 animate-pulse"
              />
            ))}
          </div>
        ) : prescriptions.length === 0 ? (
          <p className="text-[13px] text-gray-400 text-center py-6">
            No prescriptions yet.
          </p>
        ) : (
          <motion.div
            className="flex flex-col gap-2"
            variants={{ show: { transition: { staggerChildren: 0.06 } } }}
            initial="hidden"
            animate="show"
          >
            {prescriptions.map((rx) => (
              <PrescriptionCard
                key={rx.id}
                rx={rx}
                onClick={() => setSelected(rx)}
              />
            ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
