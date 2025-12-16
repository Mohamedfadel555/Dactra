import { useQuery } from "@tanstack/react-query";
import { useAdminAPI } from "../../api/adminAPI";
import { MdLocalHospital, MdPeople, MdScience, MdScanner } from "react-icons/md";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

export default function DashboardPage() {
  const adminAPI = useAdminAPI();

  // Fetch summary stats (doctorsCount, patientsCount, labCount, scanCount)
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["admin-summary"],
    queryFn: async () => {
      const res = await adminAPI.getSummary();
      return res.data; // { doctorsCount, patientsCount, labCount, scanCount }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  // Fetch weekly summary (appointments per day)
  const { data: weeklyData, isLoading: weeklyLoading } = useQuery({
    queryKey: ["admin-weekly-summary"],
    queryFn: async () => {
      const res = await adminAPI.getWeeklySummary();
      return res.data; // { Saturday, Sunday, Monday, Tuesday, Wednesday, Thursday, Friday }
    },
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
    retry: 2,
  });

  const weeklyChartData = [
    "Saturday",
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ].map((day) => ({
    day,
    appointments: weeklyData ? weeklyData[day] || 0 : 0,
  }));

  // Calculate max value for chart (round up to nearest 10)
  const maxValue = weeklyData
    ? Math.max(
        weeklyData.Saturday || 0,
        weeklyData.Sunday || 0,
        weeklyData.Monday || 0,
        weeklyData.Tuesday || 0,
        weeklyData.Wednesday || 0,
        weeklyData.Thursday || 0,
        weeklyData.Friday || 0
      )
    : 80;
  const chartMax = maxValue > 0 ? Math.ceil(maxValue / 10) * 10 : 80;

  const totalAppointments = weeklyChartData.reduce(
    (sum, item) => sum + (item.appointments || 0),
    0
  );

  const weekdaysAppointments = weeklyChartData
    .filter((d) =>
      ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday"].includes(d.day)
    )
    .reduce((sum, d) => sum + (d.appointments || 0), 0);

  const weekendAppointments = weeklyChartData
    .filter((d) => ["Friday", "Saturday"].includes(d.day))
    .reduce((sum, d) => sum + (d.appointments || 0), 0);

  const weekdaysPercentage = totalAppointments > 0 
    ? Math.round((weekdaysAppointments / totalAppointments) * 100) 
    : 0;
  const weekendPercentage = totalAppointments > 0 
    ? Math.round((weekendAppointments / totalAppointments) * 100) 
    : 0;

  // SVG circle calculations for 3 segments (weekdays, weekend, remaining)
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const weekdaysDash = (weekdaysPercentage / 100) * circumference;
  const weekendDash = (weekendPercentage / 100) * circumference;
  const weekdaysOffset = circumference - weekdaysDash;
  const weekendStartOffset = weekdaysOffset;

  const statCards = [
    {
      title: "Total Doctors",
      value: stats?.doctorsCount || 0,
      icon: MdLocalHospital,
      color: "bg-blue-100 text-blue-600",
    },
    {
      title: "Total Patients",
      value: stats?.patientsCount || 0,
      icon: MdPeople,
      color: "bg-green-100 text-green-600",
    },
    {
      title: "Total Scans",
      value: stats?.scanCount || 0,
      icon: MdScanner,
      color: "bg-purple-100 text-purple-600",
    },
    {
      title: "Total Labs",
      value: stats?.labCount || 0,
      icon: MdScience,
      color: "bg-red-100 text-red-600",
    },
  ];

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-sm sm:text-base text-gray-500 mt-1">
          Welcome Back To Your Management System
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {statCards.map((card, index) => {
          const IconComponent = card.icon;
          return (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.02] cursor-default"
            >
              <div>
                <p className="text-xs sm:text-sm text-gray-500 mb-1">{card.title}</p>
                <p className="text-xl sm:text-2xl font-bold text-gray-800">
                  {statsLoading ? "..." : card.value}
                </p>
              </div>
              <div className={`${card.color} p-2 sm:p-3 rounded-lg`}>
                <IconComponent className="w-5 h-5 sm:w-6 sm:h-6" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            Appointments per Day
          </h2>
          <div className="h-48 sm:h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={weeklyChartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} />
                <YAxis
                  domain={[0, chartMax]}
                  tick={{ fontSize: 10 }}
                  allowDecimals={false}
                />
                <Tooltip />
                <Bar
                  dataKey="appointments"
                  fill="#316BE8"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Circular progress chart card */}
        <div className="bg-white rounded-xl shadow-sm p-4 sm:p-6">
          <h2 className="text-base sm:text-lg font-semibold text-gray-800 mb-3 sm:mb-4">
            Weekly Activity Overview
          </h2>
          
          <div className="flex flex-col items-center justify-center gap-4">
            {/* Circular Progress Chart with 3 colors */}
            <div className="relative">
              <svg width="180" height="180" className="transform -rotate-90">
                {/* Background circle */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#e5e7eb"
                  strokeWidth="14"
                  fill="none"
                />
                {/* Weekdays segment (green) */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#10b981"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={circumference}
                  strokeDashoffset={weekdaysOffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                {/* Weekend segment (blue) - starts after weekdays */}
                <circle
                  cx="90"
                  cy="90"
                  r={radius}
                  stroke="#3b82f6"
                  strokeWidth="14"
                  fill="none"
                  strokeDasharray={`${weekendDash} ${circumference}`}
                  strokeDashoffset={weekendStartOffset}
                  strokeLinecap="round"
                  className="transition-all duration-500"
                />
                {/* Remaining segment (purple) - if any */}
                {weekdaysPercentage + weekendPercentage < 100 && (
                  <circle
                    cx="90"
                    cy="90"
                    r={radius}
                    stroke="#a855f7"
                    strokeWidth="14"
                    fill="none"
                    strokeDasharray={`${((100 - weekdaysPercentage - weekendPercentage) / 100) * circumference} ${circumference}`}
                    strokeDashoffset={weekendStartOffset - weekendDash}
                    strokeLinecap="round"
                    className="transition-all duration-500"
                  />
                )}
              </svg>
              {/* Center text */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl sm:text-3xl font-bold text-gray-800">
                  {weeklyLoading ? "..." : totalAppointments}
                </span>
                <span className="text-xs text-gray-500">Total</span>
              </div>
            </div>

            {/* Legend */}
            <div className="w-full space-y-2">
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-green-500" />
                  Weekdays
                </span>
                <span className="font-semibold text-gray-800">
                  {weeklyLoading ? "..." : `${weekdaysAppointments} (${weekdaysPercentage}%)`}
                </span>
              </div>
              <div className="flex items-center justify-between text-xs sm:text-sm">
                <span className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-500" />
                  Weekend
                </span>
                <span className="font-semibold text-gray-800">
                  {weeklyLoading ? "..." : `${weekendAppointments} (${weekendPercentage}%)`}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

