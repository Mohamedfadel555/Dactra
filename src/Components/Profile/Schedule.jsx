import { useState, useMemo, useRef } from "react";
import { BiCalendar, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsCameraVideo, BsPeopleFill } from "react-icons/bs";
import { RiErrorWarningLine } from "react-icons/ri";
import { useSaveSlots } from "../../hooks/useSaveSlots";
import { useBook } from "../../hooks/useBook";

// ─── Helpers ────────────────────────────────────────────────────────────────

/** "06-05-2026" from a Date */
function formatDateKey(date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${d}-${m}-${date.getFullYear()}`;
}

/** "3:30 pm" from an ISO string or "HH:MM" string */
function formatSlotLabel(value) {
  let date;
  if (typeof value === "string" && value.includes("T")) {
    date = new Date(value);
  } else if (typeof value === "number") {
    date = new Date(value);
  } else {
    const [h, m] = value.split(":");
    date = new Date();
    date.setUTCHours(+h, +m, 0, 0);
  }
  const h = date.getHours();
  const m = date.getMinutes().toString().padStart(2, "0");
  if (h === 0) return `12:${m} am`;
  if (h === 12) return `12:${m} pm`;
  if (h > 12) return `${h - 12}:${m} pm`;
  return `${h}:${m} am`;
}

/**
 * Generate ISO slot strings for a given day from working hours.
 * "14:00:00" → "14:00" → slots every `step` minutes until end.
 */
function generateSlots(startTime, endTime, stepMinutes = 30, dayKey) {
  if (!startTime || !endTime || !dayKey) return [];

  const [sh, sm] = startTime.slice(0, 5).split(":").map(Number);
  const [eh, em] = endTime.slice(0, 5).split(":").map(Number);
  const [dd, mm, yyyy] = dayKey.split("-").map(Number);

  const base = Date.UTC(yyyy, mm - 1, dd);
  const startMs = base + (sh * 60 + sm) * 60 * 1000;
  const endMs = base + (eh * 60 + em) * 60 * 1000;

  const slots = [];
  let cur = startMs;
  while (cur <= endMs) {
    slots.push(new Date(cur).toISOString().split(".")[0] + "Z");
    cur += stepMinutes * 60 * 1000;
  }
  return slots;
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function ConsultationTypePicker({ value, onChange }) {
  return (
    <div className="flex gap-3">
      {[
        { id: "in-person", label: "In-person", Icon: BsPeopleFill },
        { id: "online", label: "Online", Icon: BsCameraVideo },
      ].map(({ id, label, Icon }) => (
        <button
          key={id}
          type="button"
          onClick={() => onChange(id)}
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-sm font-medium transition-colors
            ${
              value === id
                ? "bg-blue-50 text-blue-700 border-blue-400"
                : "bg-[#F5F6F7] text-[#6D7379] border-[#BBC1C7] hover:bg-gray-100"
            }`}
        >
          <Icon className="text-[15px]" />
          {label}
        </button>
      ))}
    </div>
  );
}

function WeekNav({ weekDays, dayPicked, onPickDay, onPrev, onNext, today }) {
  const isPrevDisabled = today.toDateString() === weekDays[0].toDateString();

  return (
    <div className="flex self-center justify-center sm:justify-between max-w-[230px] sm:max-w-full w-[90%] lg:flex-nowrap lg:w-full xl:w-[90%] items-center flex-wrap gap-x-[5px] gap-y-[8px] relative">
      <button
        disabled={isPrevDisabled}
        onClick={onPrev}
        className={`flex top-0 -left-[8%] bg-white absolute sm:static justify-center items-center shadow-lg rounded-full size-[35px] sm:size-[40px] cursor-pointer
          ${isPrevDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <BiChevronLeft className="text-[30px]" />
      </button>

      {weekDays.map((day, i) => {
        const isSelected = day.toDateString() === dayPicked.toDateString();
        return (
          <div
            key={i}
            onClick={() => onPickDay(day)}
            className={`py-[5px] w-[54px] md:w-fit sm:px-[10px] rounded-md cursor-pointer flex flex-col justify-center items-center
              ${isSelected ? "bg-blue-600 text-white" : "bg-[#F5F6F7] text-[#6D7379]"}`}
          >
            <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
            <div>{day.getDate() + "/" + (day.getMonth() + 1)}</div>
          </div>
        );
      })}

      <button
        onClick={onNext}
        className="flex top-0 -right-[8%] bg-white absolute sm:static justify-center items-center shadow-lg rounded-full size-[35px] sm:size-[40px] cursor-pointer"
      >
        <BiChevronRight className="text-[30px]" />
      </button>
    </div>
  );
}

function MissingWorkDetailsWarning({ type }) {
  return (
    <div className="w-full flex flex-col items-center justify-center py-6 text-center">
      <div className="flex flex-col items-center gap-3 bg-amber-50 border border-amber-200 rounded-2xl px-6 py-5">
        <RiErrorWarningLine className="text-amber-500 text-3xl" />
        <p className="text-amber-800 font-medium">
          No {type === "in-person" ? "in-person" : "online"} working hours set
        </p>
        <p className="text-amber-600 text-sm">
          Go to Work Details and fill in the{" "}
          <span className="font-semibold">
            {type === "in-person" ? "In-person" : "Online"}
          </span>{" "}
          start & end times first.
        </p>
      </div>
    </div>
  );
}

// ─── Slot color logic (Doctor view) ─────────────────────────────────────────
//
//  DARK BLUE  → isBooked: true  (patient booked — display only, no toggle)
//  BLUE       → doctor selected this slot (isBooked: false, exists in serverSlots or pendingAdd)
//  GREY       → generated slot not selected by doctor
//
// Local state only tracks CHANGES the doctor makes this session:
//   pendingAdd    : Set of slotTime strings the doctor added (wasn't in server)
//   pendingRemove : Set of slotTime strings the doctor removed (was in server, not booked)

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Schedule({
  title,
  subtitle,
  role,
  workingDetails = { inPerson: null, online: null },
  serverSlots = { inPerson: {}, online: {} },
  isLoadingSlots = false,
  timeSlots = { inPerson: {}, online: {} }, // patient view slots
  id,
}) {
  const todayRef = useRef(new Date());
  const today = todayRef.current;

  // ── Consultation type ──────────────────────────────────────────────────────
  const [consultationType, setConsultationType] = useState("in-person");
  const typeKey = consultationType === "in-person" ? "inPerson" : "online";

  // ── Mutations ──────────────────────────────────────────────────────────────
  const saveInPersonMutation = useSaveSlots("in-person");
  const saveOnlineMutation = useSaveSlots("online");
  const saveSlotsMutation =
    consultationType === "in-person"
      ? saveInPersonMutation
      : saveOnlineMutation;

  // ── Week navigation ────────────────────────────────────────────────────────
  const [weekDays, setWeekDays] = useState(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    }),
  );
  const [dayPicked, setDayPicked] = useState(weekDays[0]);
  const dayKey = formatDateKey(dayPicked);

  function goNextWeek() {
    const last = weekDays[6];
    setWeekDays(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(last);
        d.setDate(last.getDate() + i);
        return d;
      }),
    );
  }

  function goPrevWeek() {
    const first = weekDays[0];
    setWeekDays(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(first);
        d.setDate(first.getDate() - (6 - i));
        return d;
      }),
    );
  }

  // ── Doctor pending changes ─────────────────────────────────────────────────
  // Structure: { inPerson: { "06-05-2026": { add: Set, remove: Set } }, online: {...} }
  const [pending, setPending] = useState({ inPerson: {}, online: {} });

  function getDayPending(tk, dk) {
    return pending[tk]?.[dk] ?? { add: new Set(), remove: new Set() };
  }

  function isDirty(tk) {
    return Object.keys(pending[tk] ?? {}).some((dk) => {
      const p = pending[tk][dk];
      return p.add.size > 0 || p.remove.size > 0;
    });
  }

  // ── Normalize serverSlots (guard against arrays) ───────────────────────────
  const safeServer = useMemo(
    () => ({
      inPerson: Array.isArray(serverSlots.inPerson)
        ? {}
        : (serverSlots.inPerson ?? {}),
      online: Array.isArray(serverSlots.online)
        ? {}
        : (serverSlots.online ?? {}),
    }),
    [serverSlots],
  );

  // ── Working details for current type ──────────────────────────────────────
  const activeWork = workingDetails[typeKey];
  const hasWorkDetails = !!activeWork?.workingStartTime;

  // ── Generated slots from working hours ────────────────────────────────────
  const generatedSlots = useMemo(
    () =>
      role === "Doctor" && hasWorkDetails
        ? generateSlots(
            activeWork.workingStartTime,
            activeWork.workingEndTime,
            activeWork.consultationDurationMinutes || 30,
            dayKey,
          )
        : [],
    [role, hasWorkDetails, activeWork, dayKey],
  );

  // ── Visible slots for DOCTOR ───────────────────────────────────────────────
  //
  // Rules:
  //  1. Start with all generated slots (from working hours)
  //  2. Add any booked slots from server that are OUTSIDE working hours
  //  3. Filter past slots if today
  //
  const doctorVisibleSlots = useMemo(() => {
    if (role !== "Doctor") return [];

    const serverDaySlots = safeServer[typeKey]?.[dayKey] ?? [];
    const generatedSet = new Set(generatedSlots);

    // Booked slots outside working hours — must always show
    const extraBooked = serverDaySlots
      .filter((s) => s.isBooked && !generatedSet.has(s.slotTime))
      .map((s) => s.slotTime);

    const allSlots = [...generatedSlots, ...extraBooked];

    // Filter past slots on today
    const isToday = dayKey === formatDateKey(today);
    if (!isToday) return allSlots;

    const cutoff = new Date(today.getTime() + 30 * 60 * 1000);
    return allSlots.filter((iso) => new Date(iso) >= cutoff);
  }, [role, safeServer, typeKey, dayKey, generatedSlots, today]);

  // ── Slot state for doctor ──────────────────────────────────────────────────
  //
  //  "booked"    → dark blue, no toggle
  //  "selected"  → blue (doctor chose it)
  //  "available" → grey (not chosen)
  //
  function getDoctorSlotState(iso) {
    const serverDaySlots = safeServer[typeKey]?.[dayKey] ?? [];
    const serverSlot = serverDaySlots.find((s) => s.slotTime === iso);
    const { add, remove } = getDayPending(typeKey, dayKey);

    if (serverSlot?.isBooked) return "booked";

    // Check pending changes first
    if (add.has(iso)) return "selected";
    if (remove.has(iso)) return "available";

    // Fall back to server state
    if (serverSlot && !serverSlot.isBooked) return "selected";

    return "available";
  }

  function slotClassName(state) {
    if (state === "booked")
      return "bg-blue-900 text-white cursor-not-allowed opacity-80";
    if (state === "selected") return "bg-blue-600 text-white cursor-pointer";
    return "bg-[#F5F6F7] text-[#6D7379] cursor-pointer";
  }

  // ── Toggle a single doctor slot ────────────────────────────────────────────
  function doctorToggleSlot(iso) {
    const state = getDoctorSlotState(iso);
    if (state === "booked") return;

    setPending((prev) => {
      const dayP = getDayPending(typeKey, dayKey);
      const add = new Set(dayP.add);
      const remove = new Set(dayP.remove);

      if (state === "selected") {
        // Deselect: if it came from server → mark remove; if from add → just un-add
        const inServer = !!(safeServer[typeKey]?.[dayKey] ?? []).find(
          (s) => s.slotTime === iso && !s.isBooked,
        );
        if (inServer) {
          remove.add(iso);
          add.delete(iso);
        } else {
          add.delete(iso);
        }
      } else {
        // Select: if it was removed from server → un-remove; else add
        if (remove.has(iso)) {
          remove.delete(iso);
        } else {
          add.add(iso);
        }
      }

      return {
        ...prev,
        [typeKey]: {
          ...prev[typeKey],
          [dayKey]: { add, remove },
        },
      };
    });
  }

  // ── Select / Deselect all ──────────────────────────────────────────────────
  const selectableSlots = doctorVisibleSlots.filter(
    (iso) => getDoctorSlotState(iso) !== "booked",
  );

  const allSelected =
    selectableSlots.length > 0 &&
    selectableSlots.every((iso) => getDoctorSlotState(iso) === "selected");

  function doctorToggleAll() {
    const serverDaySlots = safeServer[typeKey]?.[dayKey] ?? [];
    const serverMap = new Map(serverDaySlots.map((s) => [s.slotTime, s]));

    setPending((prev) => {
      let add = new Set();
      let remove = new Set();

      if (allSelected) {
        // Deselect all selectable
        selectableSlots.forEach((iso) => {
          if (serverMap.has(iso) && !serverMap.get(iso).isBooked) {
            remove.add(iso);
          }
          // Generated slots not in server just won't be in add → grey
        });
      } else {
        // Select all selectable
        selectableSlots.forEach((iso) => {
          const s = serverMap.get(iso);
          if (!s) {
            // generated slot not in server → add
            add.add(iso);
          } else if (!s.isBooked) {
            // in server, not booked → make sure not removed
            remove.delete(iso);
          }
        });
      }

      return {
        ...prev,
        [typeKey]: {
          ...prev[typeKey],
          [dayKey]: { add, remove },
        },
      };
    });
  }

  // ── Save ───────────────────────────────────────────────────────────────────
  async function handleSave() {
    const daysPending = pending[typeKey] ?? {};

    // Build payload: for each dirty day, compute final selected slots
    const slots = {};

    Object.keys(daysPending).forEach((dk) => {
      const { add, remove } = daysPending[dk];
      if (add.size === 0 && remove.size === 0) return;

      const serverDaySlots = safeServer[typeKey]?.[dk] ?? [];

      const finalSlots = [];

      // Server slots that are selected (not booked, not removed)
      serverDaySlots.forEach((s) => {
        if (s.isBooked) return; // never send booked
        if (remove.has(s.slotTime)) return; // doctor removed it
        finalSlots.push({ slotTime: s.slotTime, isBooked: false });
      });

      // Pending adds (generated slots the doctor newly selected)
      add.forEach((iso) => {
        if (!serverDaySlots.find((s) => s.slotTime === iso)) {
          finalSlots.push({ slotTime: iso, isBooked: false });
        }
      });

      slots[dk] = finalSlots;
    });

    if (Object.keys(slots).length === 0) return;

    console.log("hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    console.log("Saving slots:", { slots });
    await saveSlotsMutation.mutateAsync({ slots });

    // Clear pending after save
    setPending((prev) => ({ ...prev, [typeKey]: {} }));
  }

  // ── Patient state ──────────────────────────────────────────────────────────
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const bookMutation = useBook(
    consultationType === "in-person" ? "cash" : "online",
    id,
  );

  async function handleBook() {
    if (!selectedSlot) return;
    await bookMutation.mutateAsync(selectedSlot.slotId);
  }

  // ── Patient visible slots ──────────────────────────────────────────────────
  const patientVisibleSlots = useMemo(() => {
    if (role === "Doctor") return [];

    const daySlots = (timeSlots[typeKey]?.[dayKey] ?? []).filter(
      (s) => !s.isBooked,
    );

    const isToday = dayKey === formatDateKey(today);
    if (!isToday) return daySlots;

    const cutoff = new Date(today.getTime() + 30 * 60 * 1000);
    return daySlots.filter((s) => new Date(s.slotTime) >= cutoff);
  }, [role, timeSlots, typeKey, dayKey, today]);

  // ─────────────────────────────────────────────────────────────────────────
  const isDoctor = role === "Doctor";
  const visibleSlots = isDoctor ? doctorVisibleSlots : patientVisibleSlots;
  const isEmpty = visibleSlots.length === 0;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] font-bold">{title}</p>

      <ConsultationTypePicker
        value={consultationType}
        onChange={(type) => {
          setConsultationType(type);
          setSelectedSlot(null);
          setSelectedDay(null);
        }}
      />

      <div className="flex flex-col gap-[10px] border p-[10px] rounded-xl border-[#BBC1C7]">
        {/* Header */}
        <div className="flex justify-between items-center gap-[5px]">
          <p className="text-[16px] text-[#404448]">{subtitle}</p>
          <div className="flex items-center gap-2 text-[#404448]">
            <BiCalendar className="size-[20px]" />
            {weekDays[6].toLocaleDateString("en-US", { month: "long" })},{" "}
            {weekDays[6].getFullYear()}
          </div>
        </div>

        <hr className="w-[98%] self-center border-[#BBC1C7]" />

        {/* Type label */}
        <div className="flex items-center gap-2 text-sm text-[#6D7379]">
          {consultationType === "online" ? (
            <BsCameraVideo className="text-blue-500" />
          ) : (
            <BsPeopleFill className="text-blue-500" />
          )}
          <span>
            {consultationType === "in-person"
              ? "In-person slots"
              : "Online consultation slots"}
          </span>
        </div>

        {/* Week nav */}
        <WeekNav
          weekDays={weekDays}
          dayPicked={dayPicked}
          onPickDay={(day) => {
            setDayPicked(day);
            setSelectedSlot(null);
            setSelectedDay(null);
          }}
          onPrev={goPrevWeek}
          onNext={goNextWeek}
          today={today}
        />

        {/* Slots grid */}
        <div className="flex flex-wrap gap-3 justify-center mt-5 max-h-[200px] overflow-scroll sm:overflow-hidden sm:max-h-[600px]">
          {isLoadingSlots ? (
            <div className="w-full flex justify-center py-6">
              <p className="text-[#6D7379] text-sm animate-pulse">
                Loading slots...
              </p>
            </div>
          ) : isDoctor && !hasWorkDetails ? (
            <MissingWorkDetailsWarning type={consultationType} />
          ) : isEmpty ? (
            <div className="w-full flex flex-col items-center justify-center py-4 text-center">
              <div className="bg-gray-100 rounded-2xl px-6 py-4 shadow-sm">
                <p className="text-gray-600 text-lg font-medium">
                  No Available Appointments
                </p>
                <p className="text-gray-400 text-sm mt-1">
                  Please select another day
                </p>
              </div>
            </div>
          ) : isDoctor ? (
            visibleSlots.map((iso, i) => {
              const state = getDoctorSlotState(iso);
              return (
                <div
                  key={i}
                  onClick={() => doctorToggleSlot(iso)}
                  className={`flex justify-center items-center py-2 rounded-md w-[90px] transition-colors ${slotClassName(state)}`}
                >
                  {formatSlotLabel(iso)}
                </div>
              );
            })
          ) : (
            visibleSlots.map((slot, i) => {
              const isSelected = selectedSlot?.slotId === slot.slotId;
              return (
                <div
                  key={i}
                  onClick={() => {
                    setSelectedSlot(slot);
                    setSelectedDay(dayPicked);
                  }}
                  className={`flex justify-center items-center py-2 rounded-md w-[90px] cursor-pointer transition-colors
                    ${isSelected ? "bg-blue-600 text-white" : "bg-[#F5F6F7] text-[#6D7379]"}`}
                >
                  {formatSlotLabel(slot.slotTime)}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-5">
          {/* Left side */}
          {isDoctor ? (
            hasWorkDetails && !isEmpty ? (
              <div
                className="cursor-pointer flex items-center gap-2"
                onClick={doctorToggleAll}
              >
                <div
                  className={`size-[18px] border border-blue-600 rounded-sm flex justify-center items-center text-white
                    ${allSelected ? "bg-blue-600" : ""}`}
                >
                  &#10004;
                </div>
                <p>{allSelected ? "Unselect All" : "Select All"}</p>
              </div>
            ) : (
              <p />
            )
          ) : selectedDay && selectedSlot ? (
            <div className="flex items-center gap-[5px]">
              {consultationType === "online" ? (
                <BsCameraVideo className="size-[20px] text-blue-600" />
              ) : (
                <BiCalendar className="size-[20px] text-blue-600" />
              )}
              <p className="text-sm">
                {`${selectedDay.toLocaleDateString("en-us", { weekday: "long" })}, ${selectedDay.toLocaleDateString("en-us", { month: "long" })} ${selectedDay.getDate()} — ${formatSlotLabel(selectedSlot.slotTime)}`}
                {consultationType === "online" && (
                  <span className="ml-2 text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                    Video call
                  </span>
                )}
              </p>
            </div>
          ) : (
            <p />
          )}

          {/* Save / Book button */}
          <button
            type="button"
            onClick={() => (isDoctor ? handleSave() : handleBook())}
            disabled={
              saveSlotsMutation.isPending ||
              (isDoctor && (!hasWorkDetails || !isDirty(typeKey))) ||
              (!isDoctor && !selectedSlot)
            }
            className="w-[100px] h-[40px] cursor-pointer font-bold rounded-[10px] bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveSlotsMutation.isPending
              ? "Saving..."
              : isDoctor
                ? "Save"
                : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
