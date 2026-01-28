import { useState } from "react";
import { BiCalendar, BiChevronLeft, BiChevronRight } from "react-icons/bi";

// const timeSlots = [
//   "12:00 am",
//   "1:00 am",
//   "2:00 am",
//   "3:00 am",
//   "4:00 am",
//   "5:00 am",
//   "6:00 am",
//   "7:00 am",
//   "8:00 am",
//   "9:00 am",
//   "10:00 am",
//   "11:00 am",
//   "12:00 pm",
//   "1:00 pm",
//   "2:00 pm",
//   "3:00 pm",
//   "4:00 pm",
//   "5:00 pm",
//   "6:00 pm",
//   "7:00 pm",
//   "8:00 pm",
//   "9:00 pm",
//   "10:00 pm",
//   "11:00 pm",
// ];

export default function Schedule({
  title,
  subtitle,
  role,
  timeSlots = [],
  data = null,
}) {
  const [table, setTable] = useState(data);
  const [selectedDay, setSelectedDay] = useState(null);
  const today = new Date();

  const [weekDays, setWeekDays] = useState(
    Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    }),
  );

  const [dayPicked, setDayPicked] = useState(weekDays.at(0));

  function getNextDays() {
    const temp = new Date(weekDays.at(6));
    setWeekDays(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(temp);
        d.setDate(temp.getDate() + i);
        return d;
      }),
    );
  }

  function getPreviousDays() {
    const temp = new Date(weekDays.at(0));
    setWeekDays(
      Array.from({ length: 7 }, (_, i) => {
        const d = new Date(temp);
        d.setDate(temp.getDate() - (6 - i));
        return d;
      }),
    );
  }

  function selectTime(timeslot) {
    const dayKey = `${dayPicked.getDate()}/${dayPicked.getMonth() + 1}/${dayPicked.getFullYear()}`;

    setTable((prev) => {
      const arr = prev[dayKey] || [];

      return {
        ...prev,
        [dayKey]: arr.includes(timeslot)
          ? arr.filter((t) => t !== timeslot)
          : [...arr, timeslot],
      };
    });
  }

  return (
    <div className="flex flex-col gap-[20px]">
      <p className="text-[20px] font-bold">{title}</p>

      <div className="flex flex-col gap-[10px] border p-[10px] rounded-xl border-[#BBC1C7] ">
        <div className="flex justify-between items-center">
          <p className="text-[16px] text-[#404448] ">{subtitle}</p>
          <p className="text-[16px] text-[#404448]  ">
            <div className="flex justify-center items-center ">
              <BiCalendar className="text-[20px]" />
              {weekDays.at(6).toLocaleDateString("en-US", { month: "long" })},
              {weekDays.at(6).getFullYear()}
            </div>
          </p>
        </div>
        <hr className="w-[98%] self-center border-[#BBC1C7]" />
        <div className="flex self-center justify-center sm:justify-between max-w-[230px] sm:max-w-full w-[90%] lg:flex-nowrap lg:w-full xl:w-[90%] items-center flex-wrap gap-x-[5px] gap-y-[8px] relative ">
          <button
            disabled={today.toDateString() === weekDays.at(0).toDateString()}
            onClick={getPreviousDays}
            className={`flex  top-0 -left-[8%]  bg-white absolute sm:static justify-center items-center shadow-lg rounded-full size-[35px] sm:size-[40px] cursor-pointer
    ${today.toDateString() === weekDays.at(0).toDateString() ? "bg-[#ffdede]! opacity-50 cursor-not-allowed! " : ""}
  `}
          >
            <BiChevronLeft className="text-[30px]" />
          </button>

          {weekDays.map((day, ind) => (
            <div
              onClick={() => setDayPicked(day)}
              key={ind}
              className={`py-[5px] w-[54px] md:w-fit px-[10px] text-[#6D7379] bg-[#F5F6F7] rounded-md cursor-pointer flex flex-col justify-center items-center ${day.toDateString() === dayPicked.toDateString() ? "bg-blue-600 text-white" : ""} `}
            >
              <div>
                {day.toLocaleDateString("en-US", {
                  weekday: "short",
                })}
              </div>

              <div>{day.getDate() + "/" + (day.getMonth() + 1)}</div>
            </div>
          ))}
          <button
            onClick={getNextDays}
            className="flex  top-0 -right-[8%]  bg-white absolute sm:static justify-center items-center shadow-lg rounded-full size-[35px] sm:size-[40px] cursor-pointer "
          >
            <BiChevronRight className="text-[30px]" />
          </button>
        </div>
        <div className="flex items-center justify-center gap-[20px] mt-[20px] flex-wrap px-[5%] ">
          {(role === "Doctor"
            ? timeSlots
            : timeSlots[
                `${dayPicked.getDate()}/${dayPicked.getMonth() + 1}/${dayPicked.getFullYear()}`
              ] || []
          ).map((t, ind) => (
            <div
              onClick={() => {
                if (role === "Doctor") {
                  selectTime(t);
                } else {
                  if (table !== t) {
                    setTable(t);
                    setSelectedDay(dayPicked);
                  } else {
                    setTable(null);
                  }
                }
              }}
              key={ind}
              className={` whitespace-nowrap  max-w-[85px] py-[5px] px-[15px] text-[#6D7379] bg-[#F5F6F7] rounded-md cursor-pointer flex flex-col justify-center items-center ${table?.[`${dayPicked.getDate()}/${dayPicked.getMonth() + 1}/${dayPicked.getFullYear()}`]?.includes(t) || table === t ? "bg-blue-600 text-white" : ""} `}
            >
              {t}
            </div>
          ))}
        </div>
        <div className="flex justify-between items-center mt-[20px] mb-[10px] ">
          {table ? (
            <p className="flex gap-[5px] items-center">
              <BiCalendar className="text-blue-600 text-xl " />
              {`${selectedDay.toLocaleDateString("en-US", {
                weekday: "long",
              })}
                ,${selectedDay.getDate()} ${selectedDay.toLocaleDateString("en-US", { month: "long" })},${selectedDay.getFullYear()}-${table}`}
            </p>
          ) : (
            <p></p>
          )}

          <button
            type="button"
            className="w-[100px] h-[40px] font-bold rounded-[10px] cursor-pointer bg-blue-600 text-white "
          >
            {role === "Doctor" ? "Save" : "Book"}
          </button>
        </div>
      </div>
    </div>
  );
}
