import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MdOutlineScience, MdClose } from "react-icons/md";
import { IoWarningOutline } from "react-icons/io5";
import { FiCheck } from "react-icons/fi";
import { useGetMySponsors } from "../../hooks/useGetMySponsors";
import { useGetLabServices } from "../../hooks/useGetLabServices";
import { useSendReferral } from "../../hooks/useSendReferral";

// ─── variants ───────────────────────────────────────────────────────────────

const overlayV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.22 } },
  exit: { opacity: 0, transition: { duration: 0.18 } },
};

const panelV = {
  hidden: { opacity: 0, scale: 0.93, y: 24 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { type: "spring", stiffness: 140, damping: 20, mass: 0.9 },
  },
  exit: { opacity: 0, scale: 0.93, y: 24, transition: { duration: 0.18 } },
};

const listV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};

const listItem = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.28, ease: "easeOut" } },
};

const stepV = {
  hidden: { opacity: 0, x: 16 },
  show: { opacity: 1, x: 0, transition: { duration: 0.32, ease: "easeOut" } },
  exit: { opacity: 0, x: -16, transition: { duration: 0.2 } },
};

// ─── component ──────────────────────────────────────────────────────────────

export default function ReferralModal({ patientId, onClose }) {
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const { data: sponsors = [], isLoading: sponsorsLoading } =
    useGetMySponsors();
  const { data: services = [], isLoading: servicesLoading } =
    useGetLabServices(selectedLabId);
  const { mutate: sendReferral, isPending } = useSendReferral();

  const selectedLab = sponsors.find((s) => s.labId === selectedLabId);

  const toggleService = (id) =>
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const handleSend = () => {
    if (!selectedLabId || selectedServices.length === 0) return;
    sendReferral(
      { patientId, labId: selectedLabId, serviceIds: selectedServices },
      { onSuccess: onClose },
    );
  };

  // ── render ─────────────────────────────────────────────────────
  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      variants={overlayV}
      initial="hidden"
      animate="show"
      exit="exit"
      onClick={onClose}
    >
      {/* blurred backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[3px]" />

      <motion.div
        className="relative z-10 w-full max-w-[480px] bg-white rounded-2xl shadow-2xl
                   flex flex-col overflow-hidden"
        variants={panelV}
        initial="hidden"
        animate="show"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
      >
        {/* ── Header ── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center size-10 rounded-xl bg-blue-50">
              <MdOutlineScience className="text-blue-600" size={22} />
            </div>
            <div>
              <p className="font-bold text-[17px] leading-tight">
                Send Lab Referral
              </p>
              <p className="text-[12px] text-gray-400 mt-0.5">
                {selectedLab ? selectedLab.labName : "Choose a sponsor lab"}
              </p>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 18 }}
            className="size-8 flex items-center justify-center rounded-full text-gray-400
                       hover:bg-gray-100 hover:text-gray-700 transition-colors"
          >
            <MdClose size={18} />
          </motion.button>
        </div>

        {/* thin accent line */}
        <div className="h-[2px] w-full bg-gradient-to-r from-blue-500 via-blue-400 to-transparent" />

        <div className="flex flex-col gap-5 px-6 py-5 max-h-[70vh] overflow-y-auto">
          {/* ── Step 1: Lab selection ── */}
          <div className="flex flex-col gap-3">
            <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
              Step 1 — Select Sponsor Lab
            </p>

            {sponsorsLoading ? (
              <LoadingDots />
            ) : sponsors.length === 0 ? (
              <EmptyState message="No active sponsor labs" />
            ) : (
              <motion.div
                className="flex flex-wrap gap-2"
                variants={listV}
                initial="hidden"
                animate="show"
              >
                {sponsors.map((s) => {
                  const active = selectedLabId === s.labId;
                  return (
                    <motion.button
                      key={s.labId}
                      variants={listItem}
                      onClick={() => {
                        setSelectedLabId(s.labId);
                        setSelectedServices([]);
                      }}
                      whileHover={{ y: -2 }}
                      whileTap={{ scale: 0.97 }}
                      className={`relative flex flex-col px-4 py-2.5 rounded-xl border text-sm
                                  font-semibold transition-all duration-200
                                  ${
                                    active
                                      ? "bg-blue-600 text-white border-blue-600 shadow-md shadow-blue-200"
                                      : "border-gray-200 text-gray-700 hover:border-blue-300 hover:bg-blue-50"
                                  }`}
                    >
                      <span>{s.labName}</span>
                      <span
                        className={`text-[10px] font-normal mt-0.5 ${active ? "text-blue-100" : "text-gray-400"}`}
                      >
                        {s.labType} · {s.discountPercent}% off
                      </span>
                      {active && (
                        <motion.span
                          layoutId="labCheck"
                          className="absolute -top-1.5 -right-1.5 size-5 bg-white rounded-full
                                     flex items-center justify-center shadow border border-blue-200"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            type: "spring",
                            stiffness: 400,
                            damping: 16,
                          }}
                        >
                          <FiCheck className="text-blue-600" size={11} />
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>
            )}
          </div>

          {/* ── Step 2: Services ── */}
          <AnimatePresence mode="wait">
            {selectedLabId && (
              <motion.div
                key="services"
                variants={stepV}
                initial="hidden"
                animate="show"
                exit="exit"
                className="flex flex-col gap-3"
              >
                <p className="text-[12px] font-semibold text-gray-400 uppercase tracking-wider">
                  Step 2 — Select Services
                </p>

                {servicesLoading ? (
                  <LoadingDots />
                ) : services.length === 0 ? (
                  <EmptyState message="No services available for this lab" />
                ) : (
                  <motion.div
                    className="flex flex-col gap-2"
                    variants={listV}
                    initial="hidden"
                    animate="show"
                  >
                    {services.map((sv) => {
                      const checked = selectedServices.includes(sv.id);
                      return (
                        <motion.label
                          key={sv.id}
                          variants={listItem}
                          whileHover={{ x: 3 }}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer
                                      transition-all duration-200 select-none
                                      ${
                                        checked
                                          ? "border-blue-400 bg-blue-50"
                                          : "border-gray-200 hover:border-blue-200 hover:bg-gray-50"
                                      }`}
                        >
                          {/* custom checkbox */}
                          <motion.div
                            className={`size-5 rounded-md border-2 flex items-center justify-center flex-shrink-0
                                        transition-colors duration-200
                                        ${checked ? "bg-blue-600 border-blue-600" : "border-gray-300"}`}
                            animate={
                              checked ? { scale: [1, 1.2, 1] } : { scale: 1 }
                            }
                            transition={{ duration: 0.22 }}
                          >
                            <AnimatePresence>
                              {checked && (
                                <motion.span
                                  initial={{ opacity: 0, scale: 0 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0 }}
                                  transition={{ duration: 0.15 }}
                                >
                                  <FiCheck className="text-white" size={11} />
                                </motion.span>
                              )}
                            </AnimatePresence>
                          </motion.div>

                          <input
                            type="checkbox"
                            className="sr-only"
                            checked={checked}
                            onChange={() => toggleService(sv.id)}
                          />

                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate">
                              {sv.name}
                            </p>
                            {sv.description && (
                              <p className="text-xs text-gray-400 mt-0.5 truncate">
                                {sv.description}
                              </p>
                            )}
                          </div>
                        </motion.label>
                      );
                    })}
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ── Footer ── */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100 bg-gray-50/60">
          <p className="text-[12px] text-gray-400">
            {selectedServices.length > 0
              ? `${selectedServices.length} service${selectedServices.length > 1 ? "s" : ""} selected`
              : "No services selected"}
          </p>

          <div className="flex gap-2">
            <motion.button
              onClick={onClose}
              whileTap={{ scale: 0.97 }}
              className="px-4 py-2 rounded-xl border border-gray-200 text-sm text-gray-600
                         hover:bg-gray-100 transition-colors font-medium"
            >
              Cancel
            </motion.button>

            <motion.button
              onClick={handleSend}
              disabled={
                !selectedLabId || selectedServices.length === 0 || isPending
              }
              whileHover={
                !selectedLabId || selectedServices.length === 0 || isPending
                  ? {}
                  : { scale: 1.03, boxShadow: "0 6px 20px rgba(37,99,235,0.3)" }
              }
              whileTap={{ scale: 0.97 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold
                         disabled:opacity-40 disabled:cursor-not-allowed
                         hover:bg-blue-700 transition-colors"
            >
              {isPending ? (
                <span className="flex items-center gap-2">
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 0.8,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                    className="inline-block size-3.5 border-2 border-white/30 border-t-white rounded-full"
                  />
                  Sending…
                </span>
              ) : (
                "Send Referral"
              )}
            </motion.button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── small helpers ───────────────────────────────────────────────────────────

function LoadingDots() {
  return (
    <div className="flex items-center gap-1.5 py-2 px-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="size-2 rounded-full bg-blue-300"
          animate={{ y: [0, -5, 0] }}
          transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.12 }}
        />
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex items-center gap-2 py-2 px-1 text-gray-400 text-sm">
      <IoWarningOutline size={16} />
      {message}
    </div>
  );
}
