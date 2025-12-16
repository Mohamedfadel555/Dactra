import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  MdDashboard,
  MdPeople,
  MdLocalHospital,
  MdScience,
  MdScanner,
  MdReportProblem,
  MdLogout,
  MdNotificationsNone,
  MdMenu,
  MdClose,
} from "react-icons/md";
import Icon from "../assets/images/icons/dactraIcon.webp";
import { LogoutAPI } from "../api/authAPI";
import { toast } from "react-toastify";

export default function AdminLayout() {
  const { logout, role, accessToken } = useAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Extract admin name from token
  const getAdminName = () => {
    if (!accessToken) return "Admin";
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.name || payload.email?.split("@")[0] || "Admin";
    } catch {
      return "Admin";
    }
  };

  const handleLogout = async () => {
    try {
      await LogoutAPI();
      logout();
      navigate("/auth/Login");
      toast.success("Logged out successfully!", {
        position: "top-center",
        closeOnClick: true,
      });
    } catch (error) {
      console.error("Logout error:", error);
      logout();
      navigate("/auth/Login");
    }
  };

  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: MdDashboard },
    {
      path: "/admin/doctors",
      label: "Doctors Management",
      icon: MdLocalHospital,
    },
    { path: "/admin/patients", label: "Patients Management", icon: MdPeople },
    { path: "/admin/labs", label: "Labs", icon: MdScience },
    { path: "/admin/scans", label: "Scans", icon: MdScanner },
    {
      path: "/admin/complaints",
      label: "Complaints/Reports",
      icon: MdReportProblem,
    },
  ];

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false);
      }
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Close sidebar when route changes on mobile
  const handleNavClick = () => {
    if (window.innerWidth < 1024) {
      setSidebarOpen(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#F5F6FA] overflow-hidden">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static w-[260px] bg-[#05162C] flex flex-col h-full z-50 transition-all duration-300 ease-in-out ${
          sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        {/* Logo */}
        <div className="p-4 lg:p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img src={Icon} alt="Dactra" className="w-8 h-8" />
            <span className="text-white text-xl font-bold">Dactra</span>
          </div>
          {/* Close button for mobile */}
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-white hover:text-gray-300"
          >
            <MdClose className="w-6 h-6" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-2 lg:px-4 py-4 space-y-2 overflow-y-auto">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={handleNavClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 lg:gap-4 h-12 px-3 lg:px-4 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-[#316BE8] text-white shadow-lg scale-[1.02]"
                      : "text-gray-300 hover:bg-gray-800 hover:scale-[1.01]"
                  }`
                }
              >
                <IconComponent className="w-5 h-5 flex-shrink-0" />
                <span className="text-sm font-medium truncate">{item.label}</span>
              </NavLink>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 lg:gap-4 w-full h-12 px-3 lg:px-4 rounded-lg text-gray-300 hover:bg-gray-800 transition-all duration-200 hover:scale-[1.02]"
          >
            <MdLogout className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm font-medium">Log Out</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col lg:ml-0 w-full lg:w-auto">
        {/* Top Bar */}
        <header className="h-16 lg:h-20 bg-white shadow-sm flex items-center justify-between px-3 sm:px-4 lg:px-6 sticky top-0 z-30 transition-all duration-200">
          {/* Left Side - Menu & Notifications */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Mobile Menu Button */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 text-gray-600 hover:text-[#316BE8] transition-all duration-200 hover:scale-110 active:scale-95"
            >
              <MdMenu className="w-6 h-6" />
            </button>
            {/* Notifications */}
            <button className="relative p-2 text-gray-600 hover:text-[#316BE8] transition-all duration-200 hover:scale-110 active:scale-95">
              <MdNotificationsNone className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
            </button>
          </div>

          {/* Right Side - Admin Name */}
          <div className="flex items-center gap-2">
            <div className="text-right hidden sm:block">
              <p className="text-xs sm:text-sm font-semibold text-gray-800">
                {getAdminName()}
              </p>
              <p className="text-[10px] sm:text-xs text-gray-500">Administrator</p>
            </div>
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-[#316BE8] flex items-center justify-center text-white font-semibold text-sm sm:text-base">
              {getAdminName()[0].toUpperCase()}
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto p-3 sm:p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

