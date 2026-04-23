import { useState, useMemo } from "react";
import { BiCalendar, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { BsCameraVideo, BsPeopleFill } from "react-icons/bs";
import { RiErrorWarningLine } from "react-icons/ri";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-toastify";
import { useSaveSlots } from "../../hooks/useSaveSlots";
import { useGetSlots } from "../../hooks/useGetSlots";
import { useGetSlotsById } from "../../hooks/useGetSlotsById";
import { useBook } from "../../hooks/useBook";

function formatDateKey(date) {
  const d = date.getDate().toString().padStart(2, "0");
  const m = (date.getMonth() + 1).toString().padStart(2, "0");
  return `${d}-${m}-${date.getFullYear()}`;
}

function formatSlotLabel(time) {
  const [h, m] = time.split(":");
  const hour = parseInt(h, 10);
  if (hour === 0) return `12:${m} am`;
  if (hour === 12) return `12:${m} pm`;
  if (hour > 12) return `${hour - 12}:${m} pm`;
  return `${h}:${m} am`;
}

function generateSlots(start, end, stepMinutes = 30) {
  if (!start || !end) return [];
  const slots = [];
  const s = new Date();
  const e = new Date();
  const [sh, sm] = start.split(":");
  const [eh, em] = end.split(":");
  s.setHours(+sh, +sm, 0, 0);
  e.setHours(+eh, +em, 0, 0);
  if (s > e) e.setDate(e.getDate() + 1);
  while (s <= e) {
    slots.push(
      `${s.getHours().toString().padStart(2, "0")}:${s
        .getMinutes()
        .toString()
        .padStart(2, "0")}`,
    );
    s.setMinutes(s.getMinutes() + stepMinutes);
  }
  return slots;
}

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
          className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl border text-sm font-medium cursor-pointer transition-colors
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

      {weekDays.map((day, i) => (
        <div
          key={i}
          onClick={() => onPickDay(day)}
          className={`py-[5px] w-[54px] md:w-fit sm:px-[10px] text-[#6D7379] bg-[#F5F6F7] rounded-md cursor-pointer flex flex-col justify-center items-center
            ${day.toDateString() === dayPicked.toDateString() ? "bg-blue-600 text-white" : ""}`}
        >
          <div>{day.toLocaleDateString("en-US", { weekday: "short" })}</div>
          <div>{day.getDate() + "/" + (day.getMonth() + 1)}</div>
        </div>
      ))}

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

export default function Schedule({
  title,
  subtitle,
  role,
  workingDetails = { inPerson: null, online: null },
  timeSlots = { inPerson: {}, online: {} },
  onlineAppointments = [],
}) {
  const today = new Date();

  // const {data:daaaa}=useGetSlotsById()

  // ── type toggle ──
  const [consultationType, setConsultationType] = useState("in-person");
  const typeKey = consultationType === "in-person" ? "inPerson" : "online";

  // ── fetch server slots (Doctor only) ──
  const { data: inPersonData = {}, isLoading: loadingIP } = useGetSlots(
    role,
    "in-person",
  );
  const { data: onlineData = {}, isLoading: loadingOL } = useGetSlots(
    role,
    "online",
  );

  // ── save mutations ──
  const saveInPersonMutation = useSaveSlots("in-person");
  const saveOnlineMutation = useSaveSlots("online");
  const saveSlotsMutation =
    consultationType === "in-person"
      ? saveInPersonMutation
      : saveOnlineMutation;

  // ── working details for active type ──
  const activeWorkDetails = workingDetails[typeKey];
  const hasWorkDetails = !!activeWorkDetails?.workingStartTime;

  // ── week navigation ──
  const [weekDays, setWeekDays] = useState(() =>
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    }),
  );
  const [dayPicked, setDayPicked] = useState(weekDays[0]);
  const dayKey = formatDateKey(dayPicked);

  function getNextDays() {
    const last = new Date(weekDays[6]);
    setWeekDays(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(last);
        d.setDate(last.getDate() + i);
        return d;
      }),
    );
  }

  function getPreviousDays() {
    const first = new Date(weekDays[0]);
    setWeekDays(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(first);
        d.setDate(first.getDate() - (6 - i));
        return d;
      }),
    );
  }

  // ── Doctor: local tables initialised from server data ──
  const [tables, setTables] = useState({
    inPerson: {},
    online: {},
  });

  // sync server data into tables when it arrives (only if local not yet dirty)
  const [syncedTypes, setSyncedTypes] = useState({
    inPerson: false,
    online: false,
  });

  if (!syncedTypes.inPerson && Object.keys(inPersonData).length > 0) {
    setTables((prev) => ({ ...prev, inPerson: inPersonData }));
    setSyncedTypes((prev) => ({ ...prev, inPerson: true }));
  }
  if (!syncedTypes.online && Object.keys(onlineData).length > 0) {
    setTables((prev) => ({ ...prev, online: onlineData }));
    setSyncedTypes((prev) => ({ ...prev, online: true }));
  }

  // track dirty days
  const [dirtyDays, setDirtyDays] = useState({
    inPerson: new Set(),
    online: new Set(),
  });

  // ── generate all slots from working hours ──
  const generatedInPerson = useMemo(
    () =>
      role === "Doctor"
        ? generateSlots(
            workingDetails.inPerson?.workingStartTime?.slice(0, 5),
            workingDetails.inPerson?.workingEndTime?.slice(0, 5),
            workingDetails.inPerson?.consultationDurationMinutes || 30,
          )
        : [],
    [role, workingDetails.inPerson],
  );

  const generatedOnline = useMemo(
    () =>
      role === "Doctor"
        ? generateSlots(
            workingDetails.online?.workingStartTime?.slice(0, 5),
            workingDetails.online?.workingEndTime?.slice(0, 5),
            workingDetails.online?.consultationDurationMinutes || 30,
          )
        : [],
    [role, workingDetails.online],
  );

  const generatedSlots =
    typeKey === "inPerson" ? generatedInPerson : generatedOnline;

  console.log(timeSlots[typeKey]);
  const visibleSlots =
    role === "Doctor"
      ? generatedSlots
      : (timeSlots[typeKey]?.[dayKey] || []).filter((s) => !s.isBooked);

  const isEmpty = visibleSlots.length === 0;

  // ── Doctor: toggle one slot ──
  function doctorToggleSlot(timeslot) {
    setTables((prev) => {
      const daySlots = prev[typeKey]?.[dayKey] || [];
      return {
        ...prev,
        [typeKey]: {
          ...prev[typeKey],
          [dayKey]: daySlots.find((s) => s.slotTime === timeslot)
            ? daySlots.filter((s) => s.slotTime !== timeslot)
            : [...daySlots, { slotTime: timeslot, isBooked: false }],
        },
      };
    });
    setDirtyDays((prev) => ({
      ...prev,
      [typeKey]: new Set([...prev[typeKey], dayKey]),
    }));
  }

  // ── Doctor: select / deselect all ──
  function doctorToggleAll() {
    setTables((prev) => {
      const daySlots = prev[typeKey]?.[dayKey] || [];
      const allSelected = daySlots.length === generatedSlots.length;
      return {
        ...prev,
        [typeKey]: {
          ...prev[typeKey],
          [dayKey]: allSelected
            ? []
            : generatedSlots.map((t) => ({ slotTime: t, isBooked: false })),
        },
      };
    });
    setDirtyDays((prev) => ({
      ...prev,
      [typeKey]: new Set([...prev[typeKey], dayKey]),
    }));
  }

  const doctorAllSelected =
    generatedSlots.length > 0 &&
    (tables[typeKey]?.[dayKey]?.length ?? 0) === generatedSlots.length;

  // ── Doctor slot colour ──
  function doctorSlotClass(t) {
    const daySlots = tables[typeKey]?.[dayKey] || [];
    if (daySlots.find((s) => s.slotTime === t && s.isBooked))
      return "bg-blue-900 text-white";
    if (daySlots.find((s) => s.slotTime === t)) return "bg-blue-600 text-white";
    return "bg-[#F5F6F7]";
  }

  // ── Doctor: save — all dirty days in one request ──
  async function handleSave() {
    const days = [...(dirtyDays[typeKey] || [])];
    if (!days.length) return;

    const slotsPayload = Object.fromEntries(
      days.map((date) => [date, tables[typeKey][date] || []]),
    );

    console.log({ slots: slotsPayload });
    await saveSlotsMutation.mutateAsync({ slots: slotsPayload });
    setDirtyDays((prev) => ({ ...prev, [typeKey]: new Set() }));
  }

  const [selectedSlot, setSelectedSlot] = useState(null);
  const [selectedDay, setSelectedDay] = useState(null);

  const bookMutation = useBook();

  async function handleBook() {
    if (!selectedSlot) return;
    await bookMutation.mutateAsync(selectedSlot.slotId);
    console.log("Book slot:", selectedSlot, consultationType);
  }

  const isLoading = role === "Doctor" && (loadingIP || loadingOL);

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] font-bold">{title}</p>

      {/* type picker */}
      <ConsultationTypePicker
        value={consultationType}
        onChange={(type) => {
          setConsultationType(type);
          setSelectedSlot(null);
          setSelectedDay(null);
        }}
      />

      {/* schedule card */}
      <div className="flex flex-col gap-[10px] border p-[10px] rounded-xl border-[#BBC1C7]">
        {/* header */}
        <div className="flex justify-between items-center gap-[5px]">
          <p className="text-[16px] text-[#404448]">{subtitle}</p>
          <div className="flex items-center gap-2 text-[#404448]">
            <BiCalendar className="size-[20px]" />
            {weekDays[6].toLocaleDateString("en-US", { month: "long" })},{" "}
            {weekDays[6].getFullYear()}
          </div>
        </div>

        <hr className="w-[98%] self-center border-[#BBC1C7]" />

        {/* context label */}
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

        {/* week nav */}
        <WeekNav
          weekDays={weekDays}
          dayPicked={dayPicked}
          onPickDay={(day) => {
            setDayPicked(day);
            setSelectedSlot(null);
            setSelectedDay(null);
          }}
          onPrev={getPreviousDays}
          onNext={getNextDays}
          today={today}
        />

        {/* slots grid */}
        <div className="flex flex-wrap gap-3 justify-center mt-5 max-h-[200px] overflow-scroll sm:overflow-hidden sm:max-h-[600px]">
          {isLoading ? (
            <div className="w-full flex justify-center py-6">
              <p className="text-[#6D7379] text-sm animate-pulse">
                Loading slots...
              </p>
            </div>
          ) : role === "Doctor" && !hasWorkDetails ? (
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
          ) : (
            visibleSlots.map((t, ind) => {
              const isDoctor = role === "Doctor";
              const slotTime = isDoctor ? t : t.slotTime;
              const isSelected = !isDoctor && selectedSlot?.slotId === t.slotId;

              return (
                <div
                  key={ind}
                  onClick={() => {
                    if (isDoctor) {
                      doctorToggleSlot(t);
                    } else {
                      setSelectedSlot(t);
                      setSelectedDay(dayPicked);
                    }
                  }}
                  className={`flex justify-center items-center py-2 rounded-md cursor-pointer w-[90px]
                    ${
                      isDoctor
                        ? doctorSlotClass(t)
                        : isSelected
                          ? "bg-blue-600 text-white"
                          : "bg-[#F5F6F7]"
                    }`}
                >
                  {formatSlotLabel(slotTime)}
                </div>
              );
            })
          )}
        </div>

        {/* footer */}
        <div className="flex justify-between items-center mt-5">
          {role === "Doctor" ? (
            hasWorkDetails ? (
              <div
                className="cursor-pointer flex items-center gap-2"
                onClick={doctorToggleAll}
              >
                <div
                  className={`size-[18px] border border-blue-600 rounded-sm flex justify-center items-center text-white
                    ${doctorAllSelected ? "bg-blue-600" : ""}`}
                >
                  &#10004;
                </div>
                <p>{doctorAllSelected ? "Unselect All" : "Select All"}</p>
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

          <button
            type="button"
            onClick={() => (role === "Doctor" ? handleSave() : handleBook())}
            disabled={
              saveSlotsMutation.isPending ||
              (role === "Doctor" &&
                (!hasWorkDetails || dirtyDays[typeKey]?.size === 0)) ||
              (role !== "Doctor" && !selectedSlot)
            }
            className="w-[100px] h-[40px] cursor-pointer font-bold rounded-[10px] bg-blue-600 text-white disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saveSlotsMutation.isPending
              ? "Saving..."
              : role === "Doctor"
                ? "Save"
                : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
