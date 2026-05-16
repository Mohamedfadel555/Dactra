import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../Context/AuthContext";
import {
  MdDashboard,
  MdPeople,
  MdLocalHospital,
  MdScience,
  MdMedicalServices,
  MdReportProblem,
  MdLogout,
  MdNotificationsNone,
  MdMenu,
  MdClose,
} from "react-icons/md";
import Icon from "../assets/images/icons/dactraIcon.webp";
import { useLogout } from "../hooks/useLogout";
import { useScrollToTop } from "../hooks/useScrollToTop";

export default function AdminLayout() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const logoutMutation = useLogout();
  const mainRef = useRef(null);

  /* ── Admin name from token ── */
  const adminName = (() => {
    if (!accessToken) return "Admin";
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.name || payload.email?.split("@")[0] || "Admin";
    } catch {
      return "Admin";
    }
  })();

  /* ── Scroll main to top on route change ── */
  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0 });
  }, [location.pathname]);

  /* ── Close sidebar on route change (mobile) ── */
  useEffect(() => {
    setSidebarOpen(false);
  }, [location.pathname]);

  /* ── Close sidebar on resize to desktop ── */
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) setSidebarOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /* ── Escape key closes sidebar / dropdowns ── */
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") {
        setSidebarOpen(false);
        setOpenMenu(null);
      }
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  /* ── Lock body scroll when sidebar open on mobile ── */
  useEffect(() => {
    document.body.style.overflow = sidebarOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [sidebarOpen]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/auth/Login"),
    });
  };

  /* ── Nav items ── */
  const navItems = [
    { path: "/admin/dashboard", label: "Dashboard", icon: MdDashboard },
    {
      label: "Doctors Management",
      icon: MdLocalHospital,
      children: [
        { path: "/admin/doctors", label: "All Doctors" },
        { path: "/admin/doctors/new", label: "New Doctors" },
      ],
    },
    { path: "/admin/patients", label: "Patients Management", icon: MdPeople },
    {
      label: "Labs",
      icon: MdScience,
      children: [
        { path: "/admin/labs", label: "All Labs" },
        { path: "/admin/labs/new", label: "New Labs" },
      ],
    },
    {
      label: "Scans",
      icon: MdMedicalServices,
      children: [
        { path: "/admin/scans", label: "All Scans" },
        { path: "/admin/scans/new", label: "New Scans" },
      ],
    },
    {
      path: "/admin/complaints",
      label: "Complaints / Reports",
      icon: MdReportProblem,
    },
    {
      label: "Master Data",
      icon: MdScience,
      children: [
        { path: "/admin/majors", label: "Majors" },
        { path: "/admin/allergies", label: "Allergies" },
        { path: "/admin/chronic-diseases", label: "Chronic Diseases" },
      ],
    },
  ];

  useScrollToTop();

  return (
    <div className="flex h-screen bg-[#F5F6FA] overflow-hidden">
      {/* ── Mobile overlay ── */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ══════════════════════════════════════
          SIDEBAR
      ══════════════════════════════════════ */}
      <aside
        className={`
          fixed lg:static inset-y-0 left-0
          w-[260px] bg-[#05162C] flex flex-col h-full z-50
          transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* Logo */}
        <div className="h-16 lg:h-20 px-5 flex items-center justify-between border-b border-white/10 shrink-0">
          <div className="flex items-center gap-3">
            <img src={Icon} alt="Dactra" className="w-8 h-8" />
            <span className="text-white text-xl font-bold tracking-tight">
              Dactra
            </span>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
            aria-label="Close sidebar"
          >
            <MdClose className="w-5 h-5" />
          </button>
        </div>

        {/* Nav items */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto scrollbar-hide">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const hasChildren = Array.isArray(item.children);

            /* ── Plain link ── */
            if (!hasChildren) {
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  className={({ isActive }) =>
                    `flex items-center gap-3 h-11 px-4 rounded-xl text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-[#316BE8] text-white shadow-lg shadow-blue-900/30"
                        : "text-gray-400 hover:bg-white/8 hover:text-white"
                    }`
                  }
                >
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                  <span className="truncate">{item.label}</span>
                </NavLink>
              );
            }

            /* ── Dropdown ── */
            const isParentActive = item.children.some((child) =>
              location.pathname.startsWith(child.path),
            );
            const isOpen = openMenu === item.label || isParentActive;

            return (
              <div key={item.label}>
                <button
                  type="button"
                  onClick={() =>
                    setOpenMenu((prev) =>
                      prev === item.label ? null : item.label,
                    )
                  }
                  className={`
                    flex items-center justify-between gap-3 w-full h-11 px-4 rounded-xl
                    text-sm font-medium transition-all duration-200
                    ${
                      isParentActive
                        ? "bg-[#316BE8] text-white shadow-lg shadow-blue-900/30"
                        : "text-gray-400 hover:bg-white/8 hover:text-white"
                    }
                  `}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <IconComponent className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={`w-4 h-4 flex-shrink-0 transition-transform duration-200 ${isOpen ? "rotate-90" : ""}`}
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>

                {/* Children */}
                <div
                  className={`overflow-hidden transition-all duration-200 ${
                    isOpen ? "max-h-48 opacity-100 mt-1" : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="ml-9 pl-3 border-l border-white/10 space-y-0.5 py-1">
                    {item.children.map((child) => (
                      <NavLink
                        key={child.path}
                        to={child.path}
                        end={[
                          "/admin/doctors",
                          "/admin/labs",
                          "/admin/scans",
                        ].includes(child.path)}
                        className={({ isActive }) =>
                          `flex items-center h-9 px-3 rounded-lg text-[13px] transition-all duration-150 ${
                            isActive
                              ? "bg-[#316BE8]/20 text-white font-semibold"
                              : "text-gray-400 hover:bg-white/8 hover:text-white"
                          }`
                        }
                      >
                        <span className="truncate">{child.label}</span>
                      </NavLink>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-3 border-t border-white/10 shrink-0">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full h-11 px-4 rounded-xl text-sm font-semibold text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all duration-200"
          >
            <MdLogout className="w-5 h-5 flex-shrink-0" />
            <span>Log Out</span>
          </button>
        </div>
      </aside>

      {/* ══════════════════════════════════════
          MAIN CONTENT
      ══════════════════════════════════════ */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top bar */}
        <header className="h-16 lg:h-20 bg-white border-b border-gray-100 flex items-center justify-between px-4 lg:px-6 sticky top-0 z-30 shrink-0">
          {/* Left */}
          <div className="flex items-center gap-3">
            {/* Hamburger */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 -ml-1 rounded-lg text-gray-500 hover:text-[#316BE8] hover:bg-blue-50 transition-all duration-200"
              aria-label="Open sidebar"
            >
              <MdMenu className="w-6 h-6" />
            </button>

            {/* Page title derived from path */}
            <h1 className="text-base lg:text-lg font-semibold text-gray-800 capitalize hidden sm:block">
              {location.pathname
                .split("/")
                .filter(Boolean)
                .slice(1)
                .join(" / ") || "Dashboard"}
            </h1>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Notifications */}
            {/* <button className="relative p-2 rounded-lg text-gray-500 hover:text-[#316BE8] hover:bg-blue-50 transition-all duration-200">
              <MdNotificationsNone className="w-6 h-6" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse" />
            </button> */}

            {/* Admin info */}
            <div className="flex items-center gap-2.5">
              <div className="hidden sm:block text-right">
                <p className="text-sm font-semibold text-gray-800 leading-none">
                  {adminName}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Administrator
                </p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#316BE8] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200 shrink-0">
                {adminName[0].toUpperCase()}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main ref={mainRef} className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
