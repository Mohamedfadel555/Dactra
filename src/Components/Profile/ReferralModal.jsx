import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiFlaskLine,
  RiCloseLine,
  RiCheckLine,
  RiAlertLine,
  RiSendPlaneLine,
  RiTestTubeLine,
  RiDiscountPercentLine,
  RiArrowRightLine,
} from "react-icons/ri";
import { useGetMySponsors } from "../../hooks/useGetMySponsors";
import { useGetLabServices } from "../../hooks/useGetLabServices";
import { useSendReferral } from "../../hooks/useSendReferral";

const overlayV = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const panelV = {
  hidden: { opacity: 0, y: 48, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 200, damping: 26 },
  },
  exit: { opacity: 0, y: 28, scale: 0.96, transition: { duration: 0.16 } },
};

const listV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.06 } },
};

const itemV = {
  hidden: { opacity: 0, y: 12 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] },
  },
};

const stepV = {
  hidden: { opacity: 0, x: 20 },
  show: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] },
  },
  exit: { opacity: 0, x: -16, transition: { duration: 0.18 } },
};

const ACCENT = "#185FA5";
const ACCENT_DARK = "#1e3a5f";
const ACCENT_LIGHT = "#0ea5e9";
const HEADER_BG = "linear-gradient(135deg,#1e3a5f 0%,#185FA5 55%,#0ea5e9 100%)";

export default function ReferralModal({ patientId, onClose }) {
  const [selectedLabId, setSelectedLabId] = useState(null);
  const [selectedServices, setSelectedServices] = useState([]);

  const { data: sponsors = [], isLoading: sponsorsLoading } =
    useGetMySponsors();
  const { data: services = [], isLoading: servicesLoading } = useGetLabServices(
    sponsors.find((s) => s.sponsorshipId === selectedLabId)?.labId,
  );
  const { mutate: sendReferral, isPending } = useSendReferral();
  const selectedLab = sponsors.find((s) => s.sponsorshipId === selectedLabId);
  const canSend = selectedLabId && selectedServices.length > 0 && !isPending;

  const toggleService = (id) =>
    setSelectedServices((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id],
    );

  const handleSend = () => {
    if (!canSend) return;
    sendReferral(
      {
        patientId,
        sponsorshipId: selectedLabId,
        providerOfferingIds: selectedServices,
      },
      { onSuccess: onClose },
    );
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      variants={overlayV}
      initial="hidden"
      animate="show"
      exit="exit"
      onClick={onClose}
    >
      {/* backdrop */}
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-md" />

      <motion.div
        variants={panelV}
        initial="hidden"
        animate="show"
        exit="exit"
        onClick={(e) => e.stopPropagation()}
        className="relative z-10 w-full max-w-[520px] rounded-3xl overflow-hidden shadow-2xl shadow-slate-900/25"
      >
        {/* ── HEADER ── */}
        <div
          className="relative px-6 pt-6 pb-8 overflow-hidden"
          style={{ background: HEADER_BG }}
        >
          {/* decorative blobs */}
          <div className="absolute -top-8 -right-8 w-40 h-40 rounded-full bg-white/10" />
          <div className="absolute -bottom-10 -left-6 w-32 h-32 rounded-full bg-black/10" />
          <div className="absolute top-4 right-24 w-16 h-16 rounded-full bg-white/5" />

          <div className="relative flex items-start justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-white/15 backdrop-blur-sm border border-white/20">
                <RiFlaskLine size={26} className="text-white" />
              </div>
              <div>
                <p className="text-white font-bold text-xl tracking-tight leading-none">
                  Send Lab Referral
                </p>
                <p className="text-sky-200 text-[13px] mt-1.5 font-medium">
                  {selectedLab ? (
                    <span className="flex items-center gap-1">
                      <RiArrowRightLine size={12} />
                      {selectedLab.labName}
                    </span>
                  ) : (
                    "Select a sponsor lab to begin"
                  )}
                </p>
              </div>
            </div>

            <motion.button
              onClick={onClose}
              whileHover={{ scale: 1.1, rotate: 90 }}
              whileTap={{ scale: 0.9 }}
              transition={{ type: "spring", stiffness: 300, damping: 18 }}
              className="flex items-center justify-center w-9 h-9 rounded-xl bg-white/10 border border-white/20 text-white/70 hover:text-white hover:bg-white/20 transition-colors"
            >
              <RiCloseLine size={18} />
            </motion.button>
          </div>

          {/* step progress */}
          <div className="relative flex items-center gap-2 mt-6">
            {[
              { label: "Lab", done: !!selectedLabId },
              { label: "Services", done: selectedServices.length > 0 },
              { label: "Confirm", done: false },
            ].map((step, i, arr) => (
              <div key={step.label} className="flex items-center gap-2">
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold transition-all duration-300
                  ${
                    step.done
                      ? "bg-white text-[#185FA5]"
                      : i === 0 && !selectedLabId
                        ? "bg-white/20 text-white border border-white/30"
                        : i === 1 && selectedLabId && !selectedServices.length
                          ? "bg-white/20 text-white border border-white/30"
                          : "bg-white/10 text-white/50"
                  }`}
                >
                  {step.done ? (
                    <RiCheckLine size={11} />
                  ) : (
                    <span className="w-3 h-3 rounded-full border border-current flex items-center justify-center text-[9px]">
                      {i + 1}
                    </span>
                  )}
                  {step.label}
                </div>
                {i < arr.length - 1 && (
                  <div
                    className={`w-6 h-px transition-all duration-300 ${step.done ? "bg-white/60" : "bg-white/20"}`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* ── BODY ── */}
        <div className="bg-white">
          <div
            className="flex flex-col gap-6 px-6 py-6 overflow-y-auto"
            style={{
              maxHeight: "50vh",
              scrollbarWidth: "thin",
              scrollbarColor: "#bae6fd transparent",
            }}
          >
            {/* Step 1 */}
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-2">
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center"
                  style={{ background: ACCENT }}
                >
                  <span className="text-white text-[10px] font-bold">1</span>
                </div>
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                  Select Sponsor Lab
                </p>
              </div>

              {sponsorsLoading ? (
                <SkeletonCards />
              ) : sponsors.length === 0 ? (
                <EmptyState message="No active sponsor labs" />
              ) : (
                <motion.div
                  className="grid grid-cols-2 gap-2.5"
                  variants={listV}
                  initial="hidden"
                  animate="show"
                >
                  {sponsors.map((s) => {
                    const active = selectedLabId === s.sponsorshipId;
                    return (
                      <motion.button
                        key={s.sponsorshipId}
                        variants={itemV}
                        onClick={() => {
                          setSelectedLabId(s.sponsorshipId);
                          setSelectedServices([]);
                        }}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.97 }}
                        style={active ? { borderColor: ACCENT } : {}}
                        className={`relative text-left p-4 rounded-2xl border-2 transition-all duration-200 overflow-hidden
                          ${
                            active
                              ? "bg-sky-50 shadow-md shadow-sky-100"
                              : "border-slate-100 bg-slate-50 hover:border-sky-200 hover:bg-sky-50/40"
                          }`}
                      >
                        {active && (
                          <div className="absolute inset-0 bg-gradient-to-br from-sky-50 to-blue-50/60 pointer-events-none" />
                        )}
                        <div className="relative">
                          <div className="flex items-start justify-between mb-2">
                            <div
                              className="w-8 h-8 rounded-xl flex items-center justify-center"
                              style={{
                                background: active ? ACCENT : undefined,
                              }}
                              className={`w-8 h-8 rounded-xl flex items-center justify-center ${!active ? "bg-slate-200" : ""}`}
                            >
                              <RiTestTubeLine
                                size={15}
                                className={
                                  active ? "text-white" : "text-slate-500"
                                }
                              />
                            </div>
                            {active && (
                              <motion.div
                                layoutId="activeCheck"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                transition={{
                                  type: "spring",
                                  stiffness: 400,
                                  damping: 18,
                                }}
                                className="w-5 h-5 rounded-full flex items-center justify-center"
                                style={{ background: ACCENT }}
                              >
                                <RiCheckLine size={11} className="text-white" />
                              </motion.div>
                            )}
                          </div>
                          <p className="text-[13px] font-bold leading-tight text-slate-700">
                            {s.labName}
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <RiDiscountPercentLine
                              size={10}
                              className="text-slate-400"
                            />
                            <span className="text-[11px] font-medium text-slate-400">
                              {s.labType} · {s.discountPercent}% off
                            </span>
                          </div>
                        </div>
                      </motion.button>
                    );
                  })}
                </motion.div>
              )}
            </div>

            {/* Step 2 */}
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
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-md flex items-center justify-center"
                      style={{ background: ACCENT }}
                    >
                      <span className="text-white text-[10px] font-bold">
                        2
                      </span>
                    </div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      Select Services
                    </p>
                  </div>

                  {servicesLoading ? (
                    <SkeletonList />
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
                            variants={itemV}
                            whileHover={{ x: 2 }}
                            style={checked ? { borderColor: ACCENT } : {}}
                            className={`flex items-center gap-3 p-3.5 rounded-2xl border-2 cursor-pointer select-none transition-all duration-200
                              ${
                                checked
                                  ? "bg-sky-50 shadow-sm shadow-sky-100"
                                  : "border-slate-100 bg-white hover:border-sky-200"
                              }`}
                          >
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() => toggleService(sv.id)}
                            />

                            <motion.div
                              animate={
                                checked ? { scale: [1, 1.2, 1] } : { scale: 1 }
                              }
                              transition={{ duration: 0.22 }}
                              className="w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-all duration-200"
                              style={
                                checked
                                  ? { background: ACCENT }
                                  : {
                                      border: "2px solid #e2e8f0",
                                      background: "white",
                                    }
                              }
                            >
                              <AnimatePresence>
                                {checked && (
                                  <motion.span
                                    initial={{ opacity: 0, scale: 0.4 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.4 }}
                                    transition={{ duration: 0.15 }}
                                  >
                                    <RiCheckLine
                                      size={12}
                                      className="text-white"
                                    />
                                  </motion.span>
                                )}
                              </AnimatePresence>
                            </motion.div>

                            <div className="flex-1 min-w-0">
                              <p className="text-[13.5px] font-semibold truncate text-slate-700">
                                {sv.name}
                              </p>
                              {sv.description && (
                                <p className="text-[11.5px] text-slate-400 mt-0.5 truncate">
                                  {sv.description}
                                </p>
                              )}
                            </div>

                            {sv.price && (
                              <span
                                className="text-[12px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 transition-all duration-200"
                                style={
                                  checked
                                    ? { background: ACCENT, color: "white" }
                                    : {}
                                }
                                className={`text-[12px] font-bold px-2.5 py-1 rounded-lg flex-shrink-0 transition-all duration-200 ${!checked ? "bg-slate-100 text-slate-500" : ""}`}
                              >
                                ${sv.price}
                              </span>
                            )}
                          </motion.label>
                        );
                      })}
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── FOOTER ── */}
          <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/80">
            <div className="flex items-center gap-2">
              <AnimatePresence>
                {selectedServices.length > 0 && (
                  <motion.div
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="w-6 h-6 rounded-full flex items-center justify-center text-white text-[11px] font-bold"
                    style={{ background: ACCENT }}
                  >
                    {selectedServices.length}
                  </motion.div>
                )}
              </AnimatePresence>
              <p
                className="text-[12.5px] font-medium transition-colors duration-200"
                style={selectedServices.length > 0 ? { color: ACCENT } : {}}
                className={`text-[12.5px] font-medium transition-colors duration-200 ${selectedServices.length === 0 ? "text-slate-400" : ""}`}
              >
                {selectedServices.length > 0
                  ? `service${selectedServices.length > 1 ? "s" : ""} selected`
                  : "No services selected"}
              </p>
            </div>

            <div className="flex gap-2.5">
              <motion.button
                onClick={onClose}
                whileHover={{ backgroundColor: "#f1f5f9" }}
                whileTap={{ scale: 0.96 }}
                className="px-5 py-2.5 rounded-xl border-2 border-slate-200 bg-white text-slate-600 text-[13px] font-semibold hover:border-slate-300 transition-colors"
              >
                Cancel
              </motion.button>

              <motion.button
                onClick={handleSend}
                disabled={!canSend}
                whileHover={
                  canSend
                    ? {
                        scale: 1.03,
                        boxShadow: "0 8px 30px rgba(14,165,233,0.3)",
                      }
                    : {}
                }
                whileTap={canSend ? { scale: 0.97 } : {}}
                transition={{ type: "spring", stiffness: 300, damping: 18 }}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-[13px] font-bold transition-all duration-200"
                style={
                  canSend
                    ? { background: HEADER_BG, color: "white" }
                    : {
                        background: "#e0f2fe",
                        color: "#7dd3fc",
                        cursor: "not-allowed",
                      }
                }
              >
                {isPending ? (
                  <>
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 0.75,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="inline-block w-3.5 h-3.5 rounded-full border-2 border-white/30 border-t-white"
                    />
                    Sending…
                  </>
                ) : (
                  <>
                    Send Referral
                    <RiSendPlaneLine size={14} />
                  </>
                )}
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function SkeletonCards() {
  return (
    <div className="grid grid-cols-2 gap-2.5">
      {[0, 1].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.2 }}
          className="h-24 rounded-2xl bg-sky-50"
        />
      ))}
    </div>
  );
}

function SkeletonList() {
  return (
    <div className="flex flex-col gap-2">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.7, 0.4] }}
          transition={{ duration: 1.4, repeat: Infinity, delay: i * 0.15 }}
          className="h-14 rounded-2xl bg-sky-50"
        />
      ))}
    </div>
  );
}

function EmptyState({ message }) {
  return (
    <div className="flex items-center gap-2.5 p-4 rounded-2xl border-2 border-dashed border-sky-100 bg-sky-50/50 text-slate-400 text-[13px] font-medium">
      <RiAlertLine size={16} className="text-sky-300 flex-shrink-0" />
      {message}
    </div>
  );
}
