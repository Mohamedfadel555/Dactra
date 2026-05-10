import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, Link } from "react-router-dom";

import { RiCalendarCheckLine, RiTimeLine } from "react-icons/ri";
import { MdOutlineVideocam, MdOutlineLocationOn } from "react-icons/md";
import {
  BsCheckCircle,
  BsXCircle,
  BsClockHistory,
  BsCreditCard2Front,
} from "react-icons/bs";
import { TbStethoscope, TbCalendarOff } from "react-icons/tb";
import { PiWarningCircleBold } from "react-icons/pi";
import {
  FiUser,
  FiX,
  FiAlertTriangle,
  FiVideo,
  FiCalendar,
  FiExternalLink,
  FiLock,
} from "react-icons/fi";

import { useAuth } from "../../Context/AuthContext";
import { useGetMyAppointments } from "../../hooks/useGetMyAppointments";
import { useGetAppointmentsStat } from "../../hooks/useGetAppointmentsStat";
import { useCancelAppointment } from "../../hooks/useCancelAppointment";
import { useResumePay } from "./../../hooks/useResumePay";
import AvatarIcon from "./../../Components/Common/AvatarIcon1";
import { useAppointmentHub } from "../../hooks/useAppointmentHub";

// ─── Constants ────────────────────────────────────────────────────────────────

const STATUS = {
  completed: {
    label: "Completed",
    Icon: BsCheckCircle,
    color: "#059669",
    light: "#ecfdf5",
    border: "#6ee7b7",
    glow: "rgba(5,150,105,0.18)",
  },
  upcoming: {
    label: "Upcoming",
    Icon: BsClockHistory,
    color: "#2563eb",
    light: "#eff6ff",
    border: "#93c5fd",
    glow: "rgba(37,99,235,0.16)",
  },
  cancelled: {
    label: "Cancelled",
    Icon: BsXCircle,
    color: "#dc2626",
    light: "#fef2f2",
    border: "#fca5a5",
    glow: "rgba(220,38,38,0.13)",
  },
  unpaid: {
    label: "Unpaid",
    Icon: PiWarningCircleBold,
    color: "#d97706",
    light: "#fffbeb",
    border: "#fcd34d",
    glow: "rgba(217,119,6,0.16)",
  },
};

// Tab label → API status enum
const TAB_TO_CODE = { upcoming: 0, completed: 1, cancelled: 2, unpaid: 3 };

const PATIENT_TABS = ["completed", "upcoming", "cancelled", "unpaid"];
const DOCTOR_TABS = ["completed", "upcoming", "cancelled"];

const PAGE_SIZE = 10;

// ─── Normalise API object → internal shape ────────────────────────────────────

function normaliseAppt(a) {
  const raw = a.status?.toLowerCase() ?? "";
  return {
    id: a.appointmentId,
    doctorId: a.doctorId,
    patientId: a.patientId,
    doctor: a.doctorName,
    specialty: a.doctorSpecialty,
    imageUrl: a.doctorImageUrl || a.patientImageUrl,
    slotDateTime: a.slotDateTime,
    type: a.appointmentType === "Online" ? "online" : "inperson",
    // "Pending" from the backend = unpaid in the UI
    status: raw === "pending" ? "unpaid" : raw,
    cancelReason: a.cancelledReason ?? null,
    bookedAt: a.bookedAt,
    patient: a.patientName ?? null,
    age: a.patientAge ?? null,
    avatar: a.doctorName
      ?.split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase(),
  };
}

// ─── Date / time helpers ──────────────────────────────────────────────────────

function diffMins(isoStr) {
  return (new Date(isoStr).getTime() - Date.now()) / 60_000;
}
function isSessionNear(isoStr, before = 30, after = 30) {
  const d = diffMins(isoStr);
  return d <= before && d >= -after;
}
function formatDate(isoStr) {
  return new Date(isoStr).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}
function formatTime(isoStr) {
  return new Date(isoStr).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

// ─── Animation variants ───────────────────────────────────────────────────────

const listV = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
  exit: { transition: { staggerChildren: 0.03, staggerDirection: -1 } },
};

const cardV = {
  hidden: { opacity: 0, y: 22, scale: 0.97 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: "spring", stiffness: 280, damping: 24 },
  },
  exit: { opacity: 0, y: -8, scale: 0.97, transition: { duration: 0.14 } },
};

// ─── TypeChip ─────────────────────────────────────────────────────────────────

function TypeChip({ type }) {
  const online = type === "online";
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold"
      style={
        online
          ? { background: "#dbeafe", color: "#1d4ed8" }
          : { background: "#f1f5f9", color: "#475569" }
      }
    >
      {online ? (
        <MdOutlineVideocam size={13} />
      ) : (
        <MdOutlineLocationOn size={13} />
      )}
      {online ? "Online" : "In-Person"}
    </span>
  );
}

// ─── StatusPill ───────────────────────────────────────────────────────────────

function StatusPill({ status }) {
  const cfg = STATUS[status] ?? STATUS.completed;
  return (
    <span
      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-black border"
      style={{
        background: cfg.light,
        color: cfg.color,
        borderColor: cfg.border,
      }}
    >
      <cfg.Icon size={12} /> {cfg.label}
    </span>
  );
}

// ─── CancelReasonBadge ────────────────────────────────────────────────────────

function CancelReasonBadge({ reason }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22 }}
      className="mt-3 flex items-start gap-2 px-3 py-2.5 rounded-xl border border-red-100 bg-red-50"
    >
      <TbCalendarOff
        size={13}
        className="flex-shrink-0 mt-0.5"
        style={{ color: "#dc2626" }}
      />
      <p className="text-xs text-red-700 font-semibold leading-relaxed">
        {reason}
      </p>
    </motion.div>
  );
}

// ─── JoinSessionButton ────────────────────────────────────────────────────────
function JoinSessionButton({ appt, onJoin }) {
  const [, setTick] = useState(0);

  useEffect(() => {
    // كل ثانية لما الزرار يكون قريب من الميعاد
    const interval = isSessionNear(appt.slotDateTime)
      ? setInterval(() => setTick((n) => n + 1), 1_000)
      : setInterval(() => setTick((n) => n + 1), 30_000);
    return () => clearInterval(interval);
  }, [appt.slotDateTime]);

  const mins = diffMins(appt.slotDateTime);
  const isVisible = mins <= 10 && mins >= -30; // يظهر من 10 دقايق قبل
  const isLive = mins <= 0; // يشتغل لما الميعاد يجي

  if (!isVisible) return null;

  // Countdown بالدقايق والثواني
  const totalSecs = Math.max(0, Math.ceil(mins * 60));
  const mm = String(Math.floor(totalSecs / 60)).padStart(2, "0");
  const ss = String(totalSecs % 60).padStart(2, "0");
  const label = isLive ? "Join Now — Session Live" : `Join in ${mm}:${ss}`;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.94, y: 8 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 22 }}
      className="mt-3"
    >
      {isLive && (
        <div className="flex items-center gap-1.5 mb-2">
          <motion.span
            animate={{ opacity: [1, 0.3, 1] }}
            transition={{ repeat: Infinity, duration: 1.2 }}
            className="w-2 h-2 rounded-full bg-emerald-500 inline-block"
          />
          <span className="text-[11px] font-black text-emerald-600">
            Session is Live
          </span>
        </div>
      )}

      <motion.button
        whileTap={isLive ? { scale: 0.96 } : {}}
        whileHover={
          isLive
            ? { scale: 1.02, boxShadow: "0 8px 28px rgba(5,150,105,0.35)" }
            : {}
        }
        onClick={() => isLive && onJoin(appt)} // ← مش بيعمل حاجة لو مش live
        disabled={!isLive}
        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-black text-white"
        style={{
          background: isLive
            ? "linear-gradient(135deg,#059669,#10b981)"
            : "#94a3b8",
          boxShadow: isLive ? "0 4px 16px rgba(5,150,105,0.25)" : "none",
          cursor: isLive ? "pointer" : "not-allowed",
          opacity: isLive ? 1 : 0.85,
        }}
      >
        <motion.span
          animate={isLive ? { scale: [1, 1.2, 1] } : {}}
          transition={{ repeat: Infinity, duration: 1.5 }}
        >
          {isLive ? <FiVideo size={13} /> : <FiLock size={13} />}
        </motion.span>
        {label}
      </motion.button>
    </motion.div>
  );
}

// ─── CancelModal ──────────────────────────────────────────────────────────────

function CancelModal({ appt, role, onClose, onConfirm, isLoading }) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState(false);

  const name = role === "Patient" ? appt.doctor : appt.patient;
  const sub = role === "Patient" ? appt.specialty : `Age ${appt.age}`;

  const handleSubmit = () => {
    if (!reason.trim()) {
      setError(true);
      return;
    }
    onConfirm(appt.id, reason.trim());
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 28 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 28 }}
        transition={{ type: "spring", stiffness: 300, damping: 26 }}
        className="relative bg-white rounded-3xl shadow-2xl w-full max-w-sm overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          className="px-6 pt-6 pb-4"
          style={{ background: "linear-gradient(135deg,#fef2f2 0%,#fff 60%)" }}
        >
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center"
              style={{ background: "#fee2e2" }}
            >
              <FiAlertTriangle size={22} style={{ color: "#dc2626" }} />
            </div>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
            >
              <FiX size={16} />
            </motion.button>
          </div>
          <h2 className="text-base font-black text-slate-800">
            Cancel Appointment?
          </h2>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Cancelling with{" "}
            <span className="font-bold text-slate-700">{name}</span>. Please
            provide a reason.
          </p>
        </div>

        {/* Preview */}
        <div
          className="mx-6 mb-4 rounded-2xl border px-4 py-3 flex items-center gap-3"
          style={{ background: "#eff6ff", borderColor: "#bfdbfe" }}
        >
          {appt.imageUrl ? (
            <img
              src={appt.imageUrl}
              alt={name}
              className="w-10 h-10 rounded-xl object-cover flex-shrink-0 border border-blue-100"
            />
          ) : (
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 text-white text-xs font-black"
              style={{ background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)" }}
            >
              {appt.avatar}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-black text-slate-800 truncate">{name}</p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              {sub} · {formatDate(new Date(appt.slotDateTime))} ·{" "}
              {formatTime(new Date(appt.slotDateTime))}
            </p>
          </div>
        </div>

        {/* Reason textarea */}
        <div className="px-6 mb-5">
          <label className="block text-xs font-black text-slate-700 mb-1.5">
            Reason <span className="text-red-500">*</span>
          </label>
          <textarea
            value={reason}
            onChange={(e) => {
              setReason(e.target.value);
              if (e.target.value.trim()) setError(false);
            }}
            placeholder="e.g. I need to reschedule due to a conflict…"
            rows={3}
            className="w-full text-xs font-medium text-slate-700 placeholder-slate-300 resize-none rounded-xl px-3 py-2.5 outline-none transition-all"
            style={{
              border: error ? "1.5px solid #fca5a5" : "1.5px solid #e2e8f0",
              background: error ? "#fff5f5" : "#f8fafc",
            }}
          />
          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-[11px] font-bold mt-1 text-red-500"
              >
                Please enter a reason before cancelling.
              </motion.p>
            )}
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="px-6 pb-6 flex gap-3">
          <motion.button
            whileTap={{ scale: 0.97 }}
            onClick={onClose}
            className="flex-1 py-3 rounded-2xl text-sm font-black text-slate-600 border border-slate-200 bg-white hover:bg-slate-50 transition-colors"
          >
            Keep It
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            whileHover={{ boxShadow: "0 8px 24px rgba(220,38,38,0.28)" }}
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex-1 py-3 rounded-2xl text-sm font-black text-white disabled:opacity-60"
            style={{ background: "linear-gradient(135deg,#dc2626,#ef4444)" }}
          >
            {isLoading ? "Cancelling…" : "Yes, Cancel"}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── AppointmentCard ──────────────────────────────────────────────────────────

function AppointmentCard({ appt, role, onCancelClick, onJoinSession }) {
  const cfg = STATUS[appt.status] ?? STATUS.completed;
  const name = role === "Patient" ? appt.doctor : appt.patient;
  const sub = role === "Patient" ? appt.specialty : `Age ${appt.age}`;
  const SubIcon = role === "Patient" ? TbStethoscope : FiUser;

  const { mutate } = useResumePay();

  return (
    <motion.div
      variants={cardV}
      onClick={appt.status === "unpaid" ? () => mutate(appt.id) : null}
      whileHover={{
        y: -3,
        boxShadow: `0 14px 40px ${cfg.glow}, 0 2px 8px rgba(0,0,0,0.05)`,
      }}
      className={`relative ${appt.status === "unpaid" ? "cursor-pointer" : null} bg-white rounded-2xl border overflow-hidden`}
      style={{ borderColor: "#e2e8f0" }}
    >
      {/* Accent bar */}
      <div
        className="absolute left-0 top-0 bottom-0 w-[3.5px] rounded-r-full"
        style={{ background: cfg.color }}
      />

      <div className="pl-5 pr-4 py-4 sm:py-5">
        <div className="flex items-start gap-3">
          {/* Photo / avatar */}
          <AvatarIcon
            user={{ imageUrl: appt.imageUrl }}
            showLabel={false}
            size="50"
          />

          <div className="flex-1 min-w-0">
            {/* Name + status */}
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div className="min-w-0">
                {/* Patient can tap doctor name → profile page */}
                {(role === "Patient" && appt.doctorId) ||
                (role === "Doctor" &&
                  (appt.status === "upcoming" ||
                    appt.status === "completed")) ? (
                  <Link
                    to={
                      role === "Doctor"
                        ? `/patient/profile/${appt.patientId}`
                        : `/doctor/profile/${appt.doctorId}`
                    }
                    className="group inline-flex items-center gap-1 font-black text-slate-800 text-sm leading-tight hover:text-blue-600 transition-colors"
                  >
                    <span className="truncate">{name}</span>
                    <FiExternalLink
                      size={11}
                      className="opacity-0 group-hover:opacity-60 transition-opacity flex-shrink-0"
                    />
                  </Link>
                ) : (
                  <p className="font-black text-slate-800 text-sm truncate leading-tight">
                    {name}
                  </p>
                )}
                <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1 font-medium">
                  <SubIcon size={11} /> {sub}
                </p>
              </div>
              <StatusPill status={appt.status} />
            </div>

            {/* Date & time */}
            <div className="mt-3 flex flex-wrap gap-3">
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <RiCalendarCheckLine size={13} style={{ color: cfg.color }} />
                {formatDate(new Date(appt.slotDateTime))}
              </span>
              <span className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
                <RiTimeLine size={13} style={{ color: cfg.color }} />
                {formatTime(new Date(appt.slotDateTime))}
              </span>
            </div>

            {/* Chips */}
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <TypeChip type={appt.type} />
              {appt.status === "unpaid" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2.5 py-1 rounded-full">
                  <BsCreditCard2Front size={11} /> Payment Pending
                </span>
              )}
            </div>

            {/* Join (upcoming + online only) */}
            {appt.status === "upcoming" && appt.type === "online" && (
              <JoinSessionButton appt={appt} onJoin={onJoinSession} />
            )}

            {/* Cancel button */}
            {appt.status === "upcoming" && (
              <div className="mt-3">
                <motion.button
                  whileTap={{ scale: 0.96 }}
                  whileHover={{ boxShadow: "0 6px 20px rgba(220,38,38,0.2)" }}
                  onClick={() => onCancelClick(appt)}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-black text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 transition-colors"
                >
                  <BsXCircle size={12} /> Cancel Appointment
                </motion.button>
              </div>
            )}

            {/* Cancel reason */}
            {appt.status === "cancelled" && appt.cancelReason && (
              <CancelReasonBadge reason={appt.cancelReason} />
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Tabs ─────────────────────────────────────────────────────────────────────

function Tabs({ tabs, active, onChange, stats }) {
  return (
    <div
      className="flex gap-2 justify-center items-center overflow-x-auto pb-1 mb-6"
      style={{ scrollbarWidth: "none" }}
    >
      {tabs.map((key) => {
        const { label, Icon, color, light } = STATUS[key];
        const count = stats?.[key] ?? 0;
        const isActive = active === key;
        return (
          <motion.button
            key={key}
            onClick={() => onChange(key)}
            whileTap={{ scale: 0.95 }}
            className="relative flex-shrink-0 flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap border transition-all duration-200"
            style={
              isActive
                ? {
                    background: color,
                    color: "#fff",
                    borderColor: color,
                    boxShadow: `0 4px 18px ${color}55`,
                  }
                : {
                    background: "#fff",
                    color: "#64748b",
                    borderColor: "#e2e8f0",
                  }
            }
          >
            <Icon size={13} />
            {label}
            <span
              className="text-[10px] font-black px-1.5 py-0.5 rounded-full min-w-[20px] text-center"
              style={
                isActive
                  ? { background: "rgba(255,255,255,0.25)", color: "#fff" }
                  : { background: light, color }
              }
            >
              {count}
            </span>
            {isActive && (
              <motion.div
                layoutId="tab-highlight"
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{
                  background:
                    "radial-gradient(circle at 50% 0%,rgba(255,255,255,0.25) 0%,transparent 70%)",
                }}
              />
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────

function Skeleton() {
  return (
    <div className="space-y-3">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="bg-white rounded-2xl border border-slate-100 p-5 relative overflow-hidden"
        >
          <div className="flex gap-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 flex-shrink-0" />
            <div className="flex-1 space-y-2 pt-1">
              <div className="h-3.5 bg-slate-100 rounded-full w-2/5" />
              <div className="h-2.5 bg-slate-100 rounded-full w-1/4" />
              <div className="h-2.5 bg-slate-100 rounded-full w-3/5 mt-3" />
            </div>
          </div>
          <motion.div
            className="absolute inset-0"
            style={{
              background:
                "linear-gradient(90deg,transparent 0%,rgba(255,255,255,0.7) 50%,transparent 100%)",
            }}
            animate={{ x: ["-100%", "200%"] }}
            transition={{
              repeat: Infinity,
              duration: 1.4,
              ease: "linear",
              delay: i * 0.15,
            }}
          />
        </div>
      ))}
    </div>
  );
}

// ─── Empty state ──────────────────────────────────────────────────────────────

function Empty({ tab, role }) {
  const { Icon, color, light, label } = STATUS[tab];
  const showBook = tab === "upcoming" && role === "Patient";

  const messages = {
    cancelled: "No cancelled appointments — great news!",
    unpaid: "You're all caught up with payments!",
    completed: "No completed appointments yet.",
    upcoming: "No upcoming appointments scheduled.",
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: "spring", stiffness: 240, damping: 22 }}
      className="flex flex-col items-center justify-center py-20 text-center"
    >
      <motion.div
        animate={{ y: [0, -10, 0] }}
        transition={{ repeat: Infinity, duration: 2.8, ease: "easeInOut" }}
        className="w-20 h-20 rounded-3xl flex items-center justify-center mb-5 shadow-sm"
        style={{ background: light }}
      >
        <Icon size={36} style={{ color }} />
      </motion.div>

      <p className="text-slate-700 font-black text-base">
        No {label} Appointments
      </p>
      <p className="text-slate-400 text-sm mt-1 font-medium">{messages[tab]}</p>

      {showBook && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Link
            to="/doctors"
            className="mt-6 inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-sm font-black text-white"
            style={{
              background: "linear-gradient(135deg,#1d4ed8,#0ea5e9)",
              boxShadow: "0 6px 20px rgba(37,99,235,0.3)",
            }}
          >
            <FiCalendar size={14} />
            Book an Appointment
          </Link>
        </motion.div>
      )}
    </motion.div>
  );
}

// ─── Pagination ───────────────────────────────────────────────────────────────

function Pagination({ page, totalPages, onPageChange }) {
  if (!totalPages || totalPages <= 1) return null;
  return (
    <div className="flex items-center justify-center gap-3 mt-7">
      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        className="px-4 py-2 rounded-xl text-xs font-black border transition-all disabled:opacity-35 disabled:cursor-not-allowed"
        style={{ background: "#fff", borderColor: "#e2e8f0", color: "#64748b" }}
      >
        ← Prev
      </motion.button>
      <span className="text-xs font-bold text-slate-400">
        {page} / {totalPages}
      </span>
      <motion.button
        whileTap={{ scale: 0.95 }}
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        className="px-4 py-2 rounded-xl text-xs font-black border transition-all disabled:opacity-35 disabled:cursor-not-allowed"
        style={{ background: "#fff", borderColor: "#e2e8f0", color: "#64748b" }}
      >
        Next →
      </motion.button>
    </div>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────

export default function MyAppointments() {
  const [activeTab, setActiveTab] = useState("upcoming");
  const [page, setPage] = useState(1);
  const [cancelTarget, setCancelTarget] = useState(null);

  const { role } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  useAppointmentHub();

  const tabs = role === "Patient" ? PATIENT_TABS : DOCTOR_TABS;
  const validTab = tabs.includes(activeTab) ? activeTab : tabs[0];

  // 1 ─ Counts for tab badges
  const { data: stats, isLoading: statsLoading } = useGetAppointmentsStat();

  // 2 ─ Paginated list for the active tab
  const {
    data: apptData,
    isLoading: apptLoading,
    isFetching,
  } = useGetMyAppointments({
    tab: TAB_TO_CODE[validTab],
    page,
  });

  console.log(apptData);

  const rawList = apptData?.items ?? [];
  const appointments = rawList.map(normaliseAppt);
  const totalPages = Math.ceil((apptData?.totalCount ?? 0) / PAGE_SIZE);

  // Reset page on tab switch
  useEffect(() => {
    setPage(1);
  }, [validTab]);

  const isDoctor = role === "Doctor";
  const accentGlow = isDoctor ? "#34d399" : "#60a5fa";
  const cancelMutation = useCancelAppointment();

  const handleCancelConfirm = useCallback(
    (id, reason) => {
      cancelMutation.mutate(
        { appointmentid: id, CancelledReason: reason },
        {
          onSuccess: () => {
            queryClient.setQueryData(
              ["appointments", TAB_TO_CODE[validTab], page], // ← التغيير هنا
              (old) => {
                if (!old) return old;
                const patch = (arr) =>
                  arr.map((a) =>
                    (a.appointmentId ?? a.id) === id
                      ? { ...a, status: "Cancelled", cancelledReason: reason }
                      : a,
                  );
                if (Array.isArray(old)) return patch(old);
                if (old.items) return { ...old, items: patch(old.items) };
                return old;
              },
            );
            queryClient.invalidateQueries({
              queryKey: ["appointment-statistics"],
            });
            setCancelTarget(null);
          },
        },
      );
    },
    [queryClient, validTab, page, cancelMutation],
  );
  const handleJoinSession = (appt) =>
    navigate(`/consultation/${appt.id}?role=${role.toLowerCase()}`);

  return (
    <div
      className="min-h-screen bg-[#f0f5ff]"
      style={{
        background: "#f0f5ff",
        fontFamily: "'Plus Jakarta Sans',sans-serif",
      }}
    >
      {/* Cancel modal */}
      <AnimatePresence>
        {cancelTarget && (
          <CancelModal
            appt={cancelTarget}
            role={role}
            onClose={() => setCancelTarget(null)}
            onConfirm={handleCancelConfirm}
            isLoading={cancelMutation.isPending}
          />
        )}
      </AnimatePresence>

      {/* ── Header ── */}
      <div className="relative overflow-hidden pt-[60px]">
        <div className="relative max-w-3xl mx-auto px-4 sm:px-6 pt-8 pb-14">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
          >
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-[#003465]">
              My Appointments
            </h1>
            <p className="text-sm mt-1 font-medium text-[#003465] opacity-70">
              {isDoctor
                ? "Manage your patient schedule"
                : "Track your health journey"}
            </p>
          </motion.div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-6 pb-14">
        {/* Tabs skeleton → real tabs */}
        {statsLoading ? (
          <div className="flex gap-2 mb-6">
            {tabs.map((k) => (
              <div
                key={k}
                className="h-10 w-28 rounded-2xl bg-white border border-slate-100 animate-pulse"
              />
            ))}
          </div>
        ) : (
          <Tabs
            tabs={tabs}
            active={validTab}
            onChange={(t) => setActiveTab(t)}
            stats={stats}
          />
        )}

        {/* List */}
        {apptLoading ? (
          <Skeleton />
        ) : (
          <>
            <AnimatePresence mode="wait">
              <motion.div
                key={`${validTab}-${page}`}
                variants={listV}
                initial="hidden"
                animate="show"
                exit="exit"
              >
                {appointments.length === 0 ? (
                  <Empty tab={validTab} role={role} />
                ) : (
                  <div className="space-y-3">
                    {appointments.map((appt) => (
                      <AppointmentCard
                        key={appt.id}
                        appt={appt}
                        role={role}
                        onCancelClick={(a) => setCancelTarget(a)}
                        onJoinSession={handleJoinSession}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />

            {/* Refetch indicator */}
            <AnimatePresence>
              {isFetching && !apptLoading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex justify-center mt-5"
                >
                  <span className="text-[11px] font-bold text-slate-400 animate-pulse">
                    Refreshing…
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    </div>
  );
}
