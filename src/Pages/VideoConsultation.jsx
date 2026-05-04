import { useState, useEffect, useRef, useCallback } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as signalR from "@microsoft/signalr";
import { useAxios } from "../hooks/useAxios";
import { useAuth } from "../Context/AuthContext";
import BrandLogo from "../Components/Common/BrandLogo";

// ─── UTILS ────────────────────────────────────────────────────────
function sanitizeDomain(raw = "") {
  const mdMatch = raw.match(/^\[([^\]]+)\]/);
  if (mdMatch) return mdMatch[1].trim();
  return raw
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/, "")
    .trim();
}

// ─── API FACTORY ─────────────────────────────────────────────────
const createVideoCallApi = (axios) => ({
  join: async (appointmentId) => {
    const { data } = await axios.post(`VideoCall/join/${appointmentId}`);
    return data;
  },
  getStatus: async (appointmentId) => {
    const { data } = await axios.get(`VideoCall/status/${appointmentId}`);
    return data;
  },
  end: async (appointmentId) => {
    const { data } = await axios.post(`VideoCall/end/${appointmentId}`);
    return data;
  },
  savePrescription: async (appointmentId, payload) => {
    const { data } = await axios.post(`Prescription/${appointmentId}`, payload);
    return data;
  },
});

function loadJitsiScript(domain) {
  return new Promise((resolve, reject) => {
    if (window.JitsiMeetExternalAPI) return resolve();
    const script = document.createElement("script");
    script.src = `https://${domain}/external_api.js`;
    script.async = true;
    script.onload = resolve;
    script.onerror = () =>
      reject(new Error(`Failed to load Jitsi script from ${domain}`));
    document.head.appendChild(script);
  });
}

// ─── STATUS OVERLAY ───────────────────────────────────────────────
function StatusOverlay({ status, isDoctor, onRejoin }) {
  if (status === "connected") return null;

  const map = {
    loading: {
      icon: <Spinner />,
      title: "Loading session...",
      sub: "Fetching consultation data",
    },
    waiting: {
      icon: <VideoIcon />,
      title: isDoctor ? "Waiting for patient..." : "Waiting for doctor...",
      sub: isDoctor
        ? "You can start now, the patient will join shortly"
        : "The call will start automatically when the doctor joins",
    },
    connecting: {
      icon: <Spinner />,
      title: "Connecting...",
      sub: "Setting up your secure video session",
    },
    left: {
      icon: <LeftIcon />,
      title: "You left the call",
      sub: "The session is still active, you can rejoin",
    },
    ended: {
      icon: <CheckIcon />,
      title: "Consultation ended",
      sub: isDoctor
        ? "You can review your notes before leaving"
        : "Your prescription will be available shortly",
    },
    error: {
      icon: <ErrorIcon />,
      title: "Connection error",
      sub: "Please refresh the page and try again",
    },
  };

  const c = map[status] || map.loading;

  return (
    <div className="absolute inset-0 z-10 flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "radial-gradient(circle, #BFDBFE 1px, transparent 1px)",
          backgroundSize: "28px 28px",
        }}
      />
      <div className="absolute w-48 h-48 rounded-full border border-blue-100 animate-ping opacity-30" />
      <div
        className="absolute w-64 h-64 rounded-full border border-blue-50 animate-ping opacity-20"
        style={{ animationDelay: "0.5s" }}
      />
      <div className="relative z-10 bg-white rounded-2xl shadow-xl border border-blue-100 px-12 py-10 flex flex-col items-center gap-5 max-w-sm text-center">
        {c.icon}
        <div>
          <p className="text-gray-800 font-semibold text-lg leading-snug">
            {c.title}
          </p>
          <p className="text-gray-400 text-sm mt-1.5 leading-relaxed">
            {c.sub}
          </p>
        </div>
        {status === "left" && onRejoin && (
          <button
            onClick={onRejoin}
            className="mt-1 px-6 py-2.5 bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold rounded-xl transition shadow-sm"
          >
            Rejoin call
          </button>
        )}
        {status === "error" && (
          <button
            onClick={() => window.location.reload()}
            className="mt-1 px-6 py-2.5 bg-red-500 hover:bg-red-600 text-white text-sm font-semibold rounded-xl transition shadow-sm"
          >
            Retry
          </button>
        )}
      </div>
    </div>
  );
}

// ─── ICONS ────────────────────────────────────────────────────────
const Spinner = () => (
  <div className="w-16 h-16 rounded-full border-4 border-blue-100 border-t-blue-500 animate-spin" />
);
const VideoIcon = () => (
  <div className="w-16 h-16 rounded-full bg-blue-50 border-2 border-blue-200 flex items-center justify-center">
    <svg className="w-7 h-7 text-blue-500" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 10l4.553-2.069A1 1 0 0121 8.82v6.362a1 1 0 01-1.447.894L15 14v-4z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
      <rect
        x="3"
        y="6"
        width="12"
        height="12"
        rx="2"
        stroke="currentColor"
        strokeWidth="1.8"
      />
    </svg>
  </div>
);
const CheckIcon = () => (
  <div className="w-16 h-16 rounded-full bg-green-50 border-2 border-green-200 flex items-center justify-center">
    <svg className="w-7 h-7 text-green-500" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 13l4 4L19 7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);
const ErrorIcon = () => (
  <div className="w-16 h-16 rounded-full bg-red-50 border-2 border-red-200 flex items-center justify-center">
    <svg className="w-7 h-7 text-red-500" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  </div>
);
const LeftIcon = () => (
  <div className="w-16 h-16 rounded-full bg-yellow-50 border-2 border-yellow-200 flex items-center justify-center">
    <svg className="w-7 h-7 text-yellow-500" viewBox="0 0 24 24" fill="none">
      <path
        d="M15 3h4a2 2 0 012 2v14a2 2 0 01-2 2h-4M10 17l5-5-5-5M15 12H3"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </div>
);

// ─── TREATMENT SCHEDULE BUILDER ───────────────────────────────────
const TIMES_OF_DAY = [
  { label: "Morning", key: "morning", default: "08:00" },
  { label: "Afternoon", key: "afternoon", default: "13:00" },
  { label: "Evening", key: "evening", default: "18:00" },
  { label: "Night", key: "night", default: "21:00" },
];

const MEAL_OPTIONS = [
  { label: "Before meals", value: "before_meals" },
  { label: "After meals", value: "after_meals" },
  { label: "With food", value: "with_food" },
  { label: "Any time", value: "any_time" },
];

const FREQ_OPTIONS = [
  { label: "Once daily", value: 1, slots: ["morning"] },
  { label: "Twice daily", value: 2, slots: ["morning", "evening"] },
  { label: "3× daily", value: 3, slots: ["morning", "afternoon", "evening"] },
  {
    label: "4× daily",
    value: 4,
    slots: ["morning", "afternoon", "evening", "night"],
  },
];

function MedicineSchedule({ medicine, index, onChange }) {
  const [freq, setFreq] = useState(FREQ_OPTIONS[1]);
  const [mealRelation, setMealRelation] = useState(MEAL_OPTIONS[0].value);
  const [times, setTimes] = useState({
    morning: "08:00",
    afternoon: "13:00",
    evening: "18:00",
    night: "21:00",
  });

  const updateFreq = (option) => {
    setFreq(option);
    notifyParent(option, mealRelation, times);
  };

  const updateMeal = (value) => {
    setMealRelation(value);
    notifyParent(freq, value, times);
  };

  const updateTime = (key, value) => {
    const next = { ...times, [key]: value };
    setTimes(next);
    notifyParent(freq, mealRelation, next);
  };

  const notifyParent = (f, m, t) => {
    onChange(index, {
      frequency: f.value,
      mealRelation: m,
      times: f.slots.map((slot) => t[slot]),
    });
  };

  useEffect(() => {
    notifyParent(freq, mealRelation, times);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const activeSlots = freq.slots;

  const formatTime = (t) => {
    const [h, m] = t.split(":");
    const hr = parseInt(h);
    return `${hr % 12 || 12}:${m} ${hr >= 12 ? "PM" : "AM"}`;
  };

  const notifPreview = activeSlots
    .map((slot) => formatTime(times[slot]))
    .join(" & ");

  const mealLabel =
    MEAL_OPTIONS.find((o) => o.value === mealRelation)?.label ?? "";

  return (
    <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3">
      <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-3">
        {medicine.name || `Medicine ${index + 1}`}
        {medicine.dose ? ` — ${medicine.dose}` : ""}
      </p>

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2 font-medium">Times per day</p>
        <div className="flex gap-1.5 flex-wrap">
          {FREQ_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateFreq(opt)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                freq.value === opt.value
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <p className="text-xs text-gray-500 mb-2 font-medium">When to take</p>
        <div className="flex gap-1.5 flex-wrap">
          {MEAL_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              type="button"
              onClick={() => updateMeal(opt.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition ${
                mealRelation === opt.value
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-500 border-gray-200 hover:border-blue-300 hover:text-blue-500"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-2 mb-3 grid-cols-2">
        {TIMES_OF_DAY.filter((t) => activeSlots.includes(t.key)).map((slot) => (
          <div key={slot.key}>
            <p className="text-xs text-gray-400 mb-1">{slot.label}</p>
            <input
              type="time"
              value={times[slot.key]}
              onChange={(e) => updateTime(slot.key, e.target.value)}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white"
            />
          </div>
        ))}
      </div>

      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-lg px-3 py-2.5">
        <svg
          className="w-4 h-4 text-blue-400 mt-0.5 flex-shrink-0"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        >
          <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0" />
        </svg>
        <div>
          <p className="text-xs font-semibold text-blue-700">
            Reminder at: {notifPreview}
          </p>
          <p className="text-xs text-blue-500 mt-0.5">
            {medicine.name || `Medicine ${index + 1}`}
            {medicine.dose ? ` ${medicine.dose}` : ""} — {mealLabel}
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── PRESCRIPTION SIDEBAR ─────────────────────────────────────────
function PrescriptionSidebar({ open, onClose, onSave, isSaving }) {
  const [activeTab, setActiveTab] = useState("rx");
  const [diagnosis, setDiagnosis] = useState("");
  const [medicines, setMedicines] = useState([
    { name: "", dose: "", duration: "" },
  ]);
  const [schedules, setSchedules] = useState([{}]);

  const addMedicine = () => {
    setMedicines([...medicines, { name: "", dose: "", duration: "" }]);
    setSchedules([...schedules, {}]);
  };

  const removeMedicine = (i) => {
    if (medicines.length === 1) return;
    setMedicines(medicines.filter((_, idx) => idx !== i));
    setSchedules(schedules.filter((_, idx) => idx !== i));
  };

  const updateMedicine = (i, field, value) => {
    const updated = [...medicines];
    updated[i][field] = value;
    setMedicines(updated);
  };

  const updateSchedule = (i, scheduleData) => {
    const updated = [...schedules];
    updated[i] = scheduleData;
    setSchedules(updated);
  };

  const handleSave = () => {
    const payload = {
      diagnosis,
      medicines: medicines.map((med, i) => ({
        ...med,
        schedule: schedules[i] || {},
      })),
    };
    onSave(payload);
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-20 bg-black/20" onClick={onClose} />
      )}
      <div
        className={`fixed top-0 right-0 h-full w-[440px] bg-white shadow-2xl z-30 flex flex-col transition-transform duration-300 ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-800">
              Prescription & Treatment Plan
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              Add diagnosis, medicines, and notification schedule
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-400 transition"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div className="flex border-b border-gray-100 px-5 pt-3">
          {[
            { key: "rx", label: "Prescription" },
            { key: "plan", label: "Treatment Plan" },
          ].map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveTab(tab.key)}
              className={`pb-2.5 mr-5 text-sm font-semibold border-b-2 transition ${
                activeTab === tab.key
                  ? "border-blue-500 text-blue-500"
                  : "border-transparent text-gray-400 hover:text-gray-600"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-5">
          {activeTab === "rx" && (
            <div className="flex flex-col gap-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Diagnosis
                </label>
                <textarea
                  value={diagnosis}
                  onChange={(e) => setDiagnosis(e.target.value)}
                  placeholder="Enter diagnosis here..."
                  rows={3}
                  className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 resize-none transition"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-3">
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Medicines
                  </label>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="flex items-center gap-1 text-xs font-semibold text-blue-500 hover:text-blue-600 transition"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 5v14M5 12h14"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                      />
                    </svg>
                    Add medicine
                  </button>
                </div>

                {medicines.map((med, i) => (
                  <div
                    key={i}
                    className="bg-gray-50 border border-gray-100 rounded-xl p-4 mb-3"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">
                        Medicine {i + 1}
                      </span>
                      {medicines.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeMedicine(i)}
                          className="text-gray-300 hover:text-red-400 transition"
                        >
                          <svg
                            className="w-4 h-4"
                            viewBox="0 0 24 24"
                            fill="none"
                          >
                            <path
                              d="M18 6L6 18M6 6l12 12"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                    <input
                      value={med.name}
                      onChange={(e) =>
                        updateMedicine(i, "name", e.target.value)
                      }
                      placeholder="Medicine name"
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white mb-2"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        value={med.dose}
                        onChange={(e) =>
                          updateMedicine(i, "dose", e.target.value)
                        }
                        placeholder="Dose (e.g. 500mg)"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white"
                      />
                      <input
                        value={med.duration}
                        onChange={(e) =>
                          updateMedicine(i, "duration", e.target.value)
                        }
                        placeholder="Duration (e.g. 7 days)"
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm text-gray-700 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition bg-white"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "plan" && (
            <div>
              <p className="text-xs text-gray-400 mb-4 leading-relaxed">
                Set notification times for each medicine. The patient will
                receive push notifications at each scheduled time via the
                Dactara app.
              </p>
              {medicines.map((med, i) => (
                <MedicineSchedule
                  key={i}
                  medicine={med}
                  index={i}
                  onChange={updateSchedule}
                />
              ))}
              <div className="bg-orange-50 border border-orange-100 rounded-xl p-4 mt-2">
                <p className="text-xs font-semibold text-orange-700 mb-1">
                  How notifications work
                </p>
                <p className="text-xs text-orange-500 leading-relaxed">
                  Push notifications are sent via Firebase FCM to the patient's
                  Dactara app. Meal-relative reminders include the meal context
                  in the notification body (e.g. "Take Amoxicillin — before
                  meals").
                </p>
              </div>
            </div>
          )}
        </div>

        <div className="p-5 border-t border-gray-100">
          <button
            type="button"
            onClick={handleSave}
            disabled={isSaving}
            className="w-full py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white font-semibold text-sm rounded-xl transition shadow-sm"
          >
            {isSaving ? "Saving..." : "Save Prescription & Schedule"}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── CONFIRM END MODAL ────────────────────────────────────────────
function ConfirmEndModal({ open, onConfirm, onCancel, onOpenPrescription }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-100 p-8 max-w-sm w-full mx-4 flex flex-col items-center gap-5 text-center">
        <div className="w-16 h-16 rounded-full bg-orange-50 border-2 border-orange-200 flex items-center justify-center">
          <svg
            className="w-8 h-8 text-orange-400"
            viewBox="0 0 24 24"
            fill="none"
          >
            <path
              d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <div>
          <p className="text-gray-800 font-bold text-lg">
            No prescription added yet
          </p>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            The patient needs a prescription and diagnosis. Add them before
            ending the session?
          </p>
        </div>
        <div className="flex flex-col gap-2 w-full">
          <button
            onClick={onOpenPrescription}
            className="w-full py-2.5 bg-blue-500 hover:bg-blue-600 text-white font-semibold text-sm rounded-xl transition"
          >
            Add prescription & plan
          </button>
          <button
            onClick={onConfirm}
            className="w-full py-2.5 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-xl transition"
          >
            End session without prescription
          </button>
          <button
            onClick={onCancel}
            className="w-full py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-600 font-semibold text-sm rounded-xl transition"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN COMPONENT ───────────────────────────────────────────────
export default function VideoConsultation() {
  const { appointmentId } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { accessToken, role } = useAuth();
  const isDoctor = role === "Doctor";
  const queryClient = useQueryClient();
  const axios = useAxios();

  const jitsiContainerRef = useRef(null);
  const jitsiApiRef = useRef(null);
  const sessionDataRef = useRef(null);
  const sessionEndedRef = useRef(false);
  // ── NEW: SignalR connection ref ──────────────────────────────────
  const hubConnectionRef = useRef(null);

  const [callStatus, setCallStatus] = useState("loading");
  const [sessionEnded, setSessionEnded] = useState(false);

  // Doctor UI state
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [prescriptionSaved, setPrescriptionSaved] = useState(false);
  const [showConfirmEnd, setShowConfirmEnd] = useState(false);

  // Keep ref in sync with state
  useEffect(() => {
    sessionEndedRef.current = sessionEnded;
  }, [sessionEnded]);

  // ── Poll session status ──────────────────────────────────────────
  const { data: statusData } = useQuery({
    queryKey: ["videoCall", "status", appointmentId],
    queryFn: () => createVideoCallApi(axios).getStatus(appointmentId),
    enabled:
      !!appointmentId &&
      !!accessToken &&
      !sessionEnded &&
      callStatus !== "error",
    refetchInterval: 6000,
  });

  // ── End session ──────────────────────────────────────────────────
  const endSessionMutation = useMutation({
    mutationFn: () => createVideoCallApi(axios).end(appointmentId),
    onSuccess: () => {
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
      sessionEndedRef.current = true;
      setSessionEnded(true);
      setCallStatus("ended");
      queryClient.invalidateQueries(["videoCall", "status", appointmentId]);
    },
    onError: () => {
      sessionEndedRef.current = true;
      setSessionEnded(true);
      setCallStatus("ended");
    },
  });

  // ── Save prescription ────────────────────────────────────────────
  const savePrescriptionMutation = useMutation({
    mutationFn: (payload) =>
      createVideoCallApi(axios).savePrescription(appointmentId, payload),
    onSuccess: () => {
      setPrescriptionSaved(true);
      setSidebarOpen(false);
    },
    onError: (err) => {
      console.error("Failed to save prescription:", err);
    },
  });

  // ── Init Jitsi ───────────────────────────────────────────────────
  const initJitsi = useCallback(async (data) => {
    if (!jitsiContainerRef.current) return;

    if (jitsiApiRef.current) {
      try {
        jitsiApiRef.current.dispose();
      } catch (_) {}
      jitsiApiRef.current = null;
    }

    jitsiContainerRef.current.innerHTML = "";
    await new Promise((resolve) => setTimeout(resolve, 100));
    if (!jitsiContainerRef.current) return;

    const jitsiDomain = sanitizeDomain(data.jitsiDomain || "8x8.vc");
    const { roomName, jitsiToken, displayName = "User", role } = data;
    const isModerator = role === "moderator";

    setCallStatus("connecting");
    await loadJitsiScript(jitsiDomain);
    if (!jitsiContainerRef.current) return;

    const jitsiOptions = {
      roomName,
      parentNode: jitsiContainerRef.current,
      configOverwrite: {
        startWithAudioMuted: false,
        startWithVideoMuted: false,
        disableDeepLinking: true,
        prejoinPageEnabled: false,
        prejoinConfig: { enabled: false },
        skipPrejoin: true,
        disableInviteFunctions: true,
        remoteVideoMenu: {
          disableKick: !isModerator,
          disableDemote: !isModerator,
        },
        lobby: { autoKnock: false, enableChat: false, enable: false },
        toolbarButtons: [
          "microphone",
          "camera",
          "hangup",
          "tileview",
          "fullscreen",
          ...(isModerator ? ["mute-everyone", "security"] : []),
        ],
      },
      interfaceConfigOverwrite: {
        SHOW_JITSI_WATERMARK: false,
        SHOW_WATERMARK_FOR_GUESTS: false,
        SHOW_BRAND_WATERMARK: false,
        TOOLBAR_ALWAYS_VISIBLE: true,
        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
        HIDE_INVITE_MORE_HEADER: true,
        MOBILE_APP_PROMO: false,
      },
      userInfo: { displayName, moderator: isModerator },
      width: "100%",
      height: "100%",
    };

    if (jitsiToken) jitsiOptions.jwt = jitsiToken;

    const jitsi = new window.JitsiMeetExternalAPI(jitsiDomain, jitsiOptions);
    jitsiApiRef.current = jitsi;

    const fallbackTimer = setTimeout(() => {
      if (jitsiApiRef.current) setCallStatus("connected");
    }, 8000);

    jitsi.addEventListeners({
      videoConferenceJoined: () => {
        clearTimeout(fallbackTimer);
        setCallStatus("connected");
      },
      videoConferenceLeft: () => {
        jitsiApiRef.current = null;
        if (!sessionEndedRef.current) setCallStatus("left");
      },
      readyToClose: () => {
        if (jitsiApiRef.current) {
          try {
            jitsiApiRef.current.dispose();
          } catch (_) {}
          jitsiApiRef.current = null;
        }
        if (!sessionEndedRef.current) setCallStatus("left");
      },
      errorOccurred: (err) => {
        if (err?.error?.isFatal) setCallStatus("error");
      },
    });
  }, []);

  // ── Rejoin ───────────────────────────────────────────────────────
  const handleRejoin = useCallback(async () => {
    if (!sessionDataRef.current) return;
    try {
      await initJitsi(sessionDataRef.current);
    } catch {
      setCallStatus("error");
    }
  }, [initJitsi]);

  // ── Doctor init on mount ─────────────────────────────────────────
  useEffect(() => {
    if (!appointmentId || !accessToken) return;
    let disposed = false;
    const api = createVideoCallApi(axios);

    (async () => {
      try {
        setCallStatus("loading");
        if (isDoctor) {
          const data = await api.join(appointmentId);
          if (disposed) return;
          setSessionEnded(false);
          sessionEndedRef.current = false;
          sessionDataRef.current = data;
          await initJitsi(data);
        } else {
          setCallStatus("waiting");
        }
      } catch (err) {
        if (!disposed) {
          console.error("Init error:", err);
          setCallStatus("error");
        }
      }
    })();

    return () => {
      disposed = true;
      if (jitsiApiRef.current) {
        jitsiApiRef.current.dispose();
        jitsiApiRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [appointmentId, accessToken]);

  // ── Patient: join when doctor comes online ───────────────────────
  useEffect(() => {
    if (isDoctor) return;
    if (!statusData?.isDoctorOnline) return;
    if (sessionEndedRef.current) return;
    if (callStatus !== "waiting") return;

    const api = createVideoCallApi(axios);
    api
      .join(appointmentId)
      .then((data) => {
        sessionDataRef.current = data;
        return initJitsi(data);
      })
      .catch(() => setCallStatus("error"));
  }, [
    statusData?.isDoctorOnline,
    callStatus,
    isDoctor,
    axios,
    appointmentId,
    initJitsi,
  ]);

  // ── NEW: SignalR — listen for CallEnded ──────────────────────────
  useEffect(() => {
    if (!appointmentId || !accessToken) return;

    const connection = new signalR.HubConnectionBuilder()
      .withUrl("https://dactra.runasp.net/hubs/videocall", {
        accessTokenFactory: () => accessToken,
      })
      .withAutomaticReconnect()
      .build();

    hubConnectionRef.current = connection;

    connection.on("CallEnded", () => {
      // Dispose Jitsi immediately
      if (jitsiApiRef.current) {
        try {
          jitsiApiRef.current.dispose();
        } catch (_) {}
        jitsiApiRef.current = null;
      }
      sessionEndedRef.current = true;
      setSessionEnded(true);
      setCallStatus("ended");
      queryClient.invalidateQueries(["videoCall", "status", appointmentId]);
    });

    connection
      .start()
      .then(() =>
        connection.invoke("JoinAppointmentGroup", Number(appointmentId)),
      )

      .catch((err) => console.error("SignalR connection failed:", err));

    return () => {
      connection
        .invoke("LeaveAppointmentGroup", Number(appointmentId))
        .catch(() => {})
        .finally(() => connection.stop());
    };
  }, [appointmentId, accessToken, queryClient]);

  // ── End session with prescription check (doctor only) ───────────
  const handleEndClick = useCallback(() => {
    if (endSessionMutation.isPending) return;
    if (isDoctor && !prescriptionSaved) {
      setShowConfirmEnd(true);
      return;
    }
    endSessionMutation.mutate();
  }, [isDoctor, prescriptionSaved, endSessionMutation]);

  const handlePrescriptionSave = useCallback(
    (payload) => {
      savePrescriptionMutation.mutate(payload);
    },
    [savePrescriptionMutation],
  );

  return (
    <div className="flex flex-col h-screen bg-white overflow-hidden font-sans">
      {/* ══ CONFIRM END MODAL ══ */}
      <ConfirmEndModal
        open={showConfirmEnd}
        onConfirm={() => {
          setShowConfirmEnd(false);
          endSessionMutation.mutate();
        }}
        onCancel={() => setShowConfirmEnd(false)}
        onOpenPrescription={() => {
          setShowConfirmEnd(false);
          setSidebarOpen(true);
        }}
      />

      {/* ══ PRESCRIPTION SIDEBAR ══ */}
      {isDoctor && (
        <PrescriptionSidebar
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          onSave={handlePrescriptionSave}
          isSaving={savePrescriptionMutation.isPending}
        />
      )}

      {/* ══ HEADER ══ */}
      <header className="flex items-center justify-between h-16 px-6 bg-white border-b border-gray-100 shadow-sm flex-shrink-0 z-30">
        <BrandLogo />

        <div className="flex items-center gap-2">
          {callStatus === "connected" ? (
            <div className="flex items-center gap-2 bg-green-50 border border-green-200 text-green-600 px-4 py-1.5 rounded-full text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Live
            </div>
          ) : callStatus === "left" ? (
            <div className="flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-600 px-4 py-1.5 rounded-full text-sm font-medium">
              <span className="w-2 h-2 rounded-full bg-yellow-400" />
              Out of call
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 text-gray-400 px-4 py-1.5 rounded-full text-sm font-medium">
              {{
                loading: "Initializing...",
                waiting: isDoctor
                  ? "Waiting for patient"
                  : "Waiting for doctor",
                connecting: "Connecting...",
                ended: "Session ended",
                error: "Connection error",
              }[callStatus] || "..."}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          {isDoctor && !sessionEnded && (
            <button
              onClick={() => setSidebarOpen(true)}
              className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-lg transition border ${
                prescriptionSaved
                  ? "bg-green-50 text-green-600 border-green-200"
                  : "bg-blue-50 hover:bg-blue-100 text-blue-600 border-blue-200"
              }`}
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              {prescriptionSaved ? "Saved" : "Prescription"}
            </button>
          )}

          {isDoctor && !sessionEnded && callStatus !== "error" && (
            <button
              onClick={handleEndClick}
              disabled={endSessionMutation.isPending}
              className="flex items-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 disabled:bg-red-300 text-white text-sm font-semibold rounded-lg transition shadow-sm"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                <path
                  d="M10.68 13.31a16 16 0 003.41 2.6l1.27-1.27a2 2 0 012.11-.45c.907.34 1.85.573 2.81.7A2 2 0 0122 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.52 10.5 19.79 19.79 0 01.44 1.88 2 2 0 012.44 0h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 7.91a16 16 0 003.77 5.4z"
                  stroke="white"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
              {endSessionMutation.isPending ? "Ending..." : "End Session"}
            </button>
          )}
        </div>
      </header>

      {/* ══ BODY ══ */}
      <div className="flex-1 relative bg-gray-900 overflow-hidden">
        <div
          ref={jitsiContainerRef}
          className="absolute inset-0 w-full h-full"
        />
        <StatusOverlay
          status={callStatus}
          isDoctor={isDoctor}
          onRejoin={!sessionEnded ? handleRejoin : null}
        />
        {(callStatus === "ended" || callStatus === "error") && (
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20">
            <button
              onClick={() => navigate("/")}
              className="px-6 py-3 bg-white border border-gray-200 rounded-xl text-gray-600 font-semibold text-sm hover:bg-gray-50 transition shadow-md"
            >
              Back to Home
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
