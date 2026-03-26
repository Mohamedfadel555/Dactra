import { useState, useMemo } from "react";
import { BiCalendar, BiChevronLeft, BiChevronRight } from "react-icons/bi";
import { useSaveAVSlots } from "../../hooks/useSaveAVSlots";
import { useBook } from "../../hooks/useBook";

export default function Schedule({
  title,
  start,
  end,
  subtitle,
  role,
  timeSlots = [],
  data = {},
}) {
  const [table, setTable] = useState(role === "Doctor" ? data : timeSlots);
  const [selectedDay, setSelectedDay] = useState(null);
  const today = new Date();

  const bookMutation = useBook();
  const saveMutation = useSaveAVSlots();

  function formatDateKey(date) {
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  }

  const generatedSlots =
    role !== "Doctor"
      ? timeSlots
      : useMemo(() => {
          if (!start || !end) return [];

          const slots = [];
          const startDate = new Date();
          const endDate = new Date();

          const [startHour, startMin] = start.split(":");
          const [endHour, endMin] = end.split(":");

          startDate.setHours(startHour, startMin, 0);
          endDate.setHours(endHour, endMin, 0);

          if (startDate > endDate) {
            endDate.setDate(endDate.getDate() + 1);
          }

          while (startDate <= endDate) {
            slots.push(
              `${startDate.getHours().toString().padStart(2, "0")}:${startDate
                .getMinutes()
                .toString()
                .padStart(2, "0")}`,
            );
            startDate.setMinutes(startDate.getMinutes() + 30);
          }

          return slots;
        }, [start, end]);

  const [weekDays, setWeekDays] = useState(
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    }),
  );

  const [dayPicked, setDayPicked] = useState(weekDays[0]);

  function getNextDays() {
    const temp = new Date(weekDays[6]);
    setWeekDays(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(temp);
        d.setDate(temp.getDate() + i);
        return d;
      }),
    );
  }

  function getPreviousDays() {
    const temp = new Date(weekDays[0]);
    setWeekDays(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(temp);
        d.setDate(temp.getDate() - (6 - i));
        return d;
      }),
    );
  }

  function selectTime(timeslot) {
    const dayKey = formatDateKey(dayPicked);

    setTable((prev) => {
      const arr = prev[dayKey] || [];

      return {
        ...prev,
        [dayKey]: arr.find((slot) => slot.slotTime === timeslot)
          ? arr.filter((t) => t.slotTime !== timeslot)
          : [...arr, { slotTime: timeslot, isBooked: false }],
      };
    });
  }

  const dayKey = formatDateKey(dayPicked);

  async function handleBook(id) {
    await bookMutation.mutateAsync(id);
  }

  async function handleSave() {
    console.log({ slots: table });
    await saveMutation.mutateAsync({
      slots: table,
    });
  }

  let emptycheck =
    (role === "Doctor" ? generatedSlots : generatedSlots[dayKey] || [])
      .length === 0;

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] font-bold">{title}</p>

      <div className="flex flex-col gap-[10px] border p-[10px] rounded-xl border-[#BBC1C7]">
        {/* Header */}
        <div className="flex justify-between items-center gap-[5px] ">
          <p className="text-[16px] text-[#404448]">{subtitle}</p>

          <div className="flex items-center gap-2 text-[#404448]">
            <BiCalendar className="size-[20px]" />
            {weekDays[6].toLocaleDateString("en-US", {
              month: "long",
            })}
            , {weekDays[6].getFullYear()}
          </div>
        </div>

        <hr className="w-[98%] self-center border-[#BBC1C7]" />

        {/* Week Navigation */}
        <div className="flex self-center justify-center sm:justify-between max-w-[230px] sm:max-w-full w-[90%] lg:flex-nowrap lg:w-full xl:w-[90%] items-center flex-wrap gap-x-[5px] gap-y-[8px] relative ">
          {" "}
          <button
            disabled={today.toDateString() === weekDays.at(0).toDateString()}
            onClick={getPreviousDays}
            className={`flex top-0 -left-[8%] bg-white absolute sm:static justify-center items-center shadow-lg rounded-full size-[35px] sm:size-[40px] cursor-pointer ${today.toDateString() === weekDays.at(0).toDateString() ? "bg-[#ffdede]! opacity-50 cursor-not-allowed! " : ""} `}
          >
            {" "}
            <BiChevronLeft className="text-[30px]" />{" "}
          </button>{" "}
          {weekDays.map((day, ind) => (
            <div
              onClick={() => setDayPicked(day)}
              key={ind}
              className={`py-[5px] w-[54px] md:w-fit sm:px-[10px] text-[#6D7379] bg-[#F5F6F7] rounded-md cursor-pointer flex flex-col justify-center items-center ${day.toDateString() === dayPicked.toDateString() ? "bg-blue-600 text-white" : ""} `}
            >
              {" "}
              <div>
                {" "}
                {day.toLocaleDateString("en-US", { weekday: "short" })}{" "}
              </div>{" "}
              <div>{day.getDate() + "/" + (day.getMonth() + 1)}</div>{" "}
            </div>
          ))}{" "}
          <button
            onClick={getNextDays}
            className="flex top-0 -right-[8%] bg-white absolute sm:static justify-center items-center shadow-lg rounded-full size-[35px] sm:size-[40px] cursor-pointer "
          >
            <BiChevronRight className="text-[30px]" />{" "}
          </button>
        </div>

        {/* Time Slots */}
        <div className="flex flex-wrap gap-3 justify-center mt-5 max-h-[200px] overflow-scroll sm:overflow-hidden sm:max-h-[600px] ">
          {emptycheck ? (
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
            (role === "Doctor"
              ? generatedSlots
              : generatedSlots[dayKey] || []
            ).map((t, ind) => (
              <div
                key={ind}
                onClick={() => {
                  if (role === "Doctor") {
                    selectTime(t);
                  } else {
                    setTable(t);
                    setSelectedDay(dayPicked);
                  }
                }}
                className={`flex justify-center items-center py-2 rounded-md cursor-pointer w-[90px] ${
                  role === "Doctor"
                    ? table?.[dayKey]?.find(
                        (slot) => slot.slotTime === t && slot.isBooked,
                      )
                      ? "bg-blue-900 text-white"
                      : table?.[dayKey]?.find((slot) => slot.slotTime === t)
                        ? "bg-blue-600 text-white"
                        : "bg-[#F5F6F7]"
                    : table === t
                      ? "bg-blue-600 text-white"
                      : "bg-[#F5F6F7]"
                }`}
              >
                {role === "Doctor"
                  ? t.split(":")[0] > 12
                    ? `${t.split(":")[0] - 12}:${t.split(":")[1]} pm`
                    : t.split(":")[0] == 0
                      ? `${12}:${t.split(":")[1]} am`
                      : `${t} am`
                  : t.slotTime.split(":")[0] > 12
                    ? `${t.slotTime.split(":")[0] - 12}:${t.slotTime.split(":")[1]} pm`
                    : t.slotTime.split(":")[0] == 0
                      ? `${12}:${t.slotTime.split(":")[1]} am`
                      : `${t.slotTime} am`}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center mt-5">
          {role === "Doctor" ? (
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={() => {
                setTable((prev) => ({
                  ...prev,
                  [dayKey]:
                    prev[dayKey]?.length === generatedSlots.length
                      ? []
                      : generatedSlots.map((t) => ({
                          slotTime: t,
                          isBooked: false,
                        })),
                }));
              }}
            >
              <div
                className={`size-[18px] border border-blue-600 rounded-sm flex justify-center items-center text-white ${
                  table[dayKey]?.length === generatedSlots.length
                    ? "bg-blue-600"
                    : ""
                }`}
              >
                &#10004;
              </div>
              <p>
                {table[dayKey]?.length === generatedSlots.length
                  ? "Unselect All"
                  : "Select All"}
              </p>
            </div>
          ) : selectedDay ? (
            <div className="flex items-center gap-[5px]">
              <BiCalendar className="size-[20px] text-blue-600 " />
              <p className="text-sm">{`${selectedDay.toLocaleDateString("en-us", { weekday: "long" })} , ${selectedDay.toLocaleDateString("en-us", { month: "long" })} ${selectedDay.getDate()}-${
                table.slotTime.split(":")[0] > 12
                  ? `${table.slotTime.split(":")[0] - 12}:${table.slotTime.split(":")[1]} pm`
                  : table.slotTime.split(":")[0] == 0
                    ? `${12}:${table.slotTime.split(":")[1]} am`
                    : `${table.slotTime} am`
              }`}</p>
            </div>
          ) : (
            <p></p>
          )}

          <button
            type="button"
            onClick={() =>
              role === "Doctor" ? handleSave() : handleBook(table.slotId)
            }
            className="w-[100px] h-[40px] cursor-pointer font-bold rounded-[10px] bg-blue-600 text-white"
          >
            {role === "Doctor" ? "Save" : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
