import { useQuery } from "@tanstack/react-query";
import { useAdminAPI } from "../../api/adminAPI";
import { MdLocalHospital, MdPeople, MdScience, MdScanner } from "react-icons/md";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

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

  // Prepare chart data from weekly summary
  const chartData = {
    labels: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    datasets: [
      {
        label: "appointments",
        data: weeklyData
          ? [
              weeklyData.Saturday || 0,
              weeklyData.Sunday || 0,
              weeklyData.Monday || 0,
              weeklyData.Tuesday || 0,
              weeklyData.Wednesday || 0,
              weeklyData.Thursday || 0,
              weeklyData.Friday || 0,
            ]
          : [0, 0, 0, 0, 0, 0, 0],
        backgroundColor: "#316BE8",
      },
    ],
  };

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

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: chartMax,
        ticks: {
          stepSize: chartMax / 4,
        },
      },
    },
  };

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
              className="bg-white rounded-xl shadow-sm p-4 sm:p-6 flex items-center justify-between"
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
            <Bar data={chartData} options={chartOptions} />
          </div>
        </div>
      </div>
    </div>
  );
}

