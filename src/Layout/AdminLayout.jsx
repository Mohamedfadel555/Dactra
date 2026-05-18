import { useState, useEffect, useRef } from "react";
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../Context/AuthContext";
import {
  MdDashboard,
  MdPeople,
  MdLocalHospital,
  MdScience,
  MdMedicalServices,
  MdReportProblem,
  MdLogout,
  MdMenu,
  MdClose,
} from "react-icons/md";
import { RiArrowRightSLine, RiArrowLeftLine } from "react-icons/ri";
import Icon from "../assets/images/icons/dactraIcon.webp";
import { useLogout } from "../hooks/useLogout";
import { useScrollToTop } from "../hooks/useScrollToTop";
import NotificationBell from "../Components/Common/NotificationBell";

function NavItem({ to, label, icon, end = false, onNavigate }) {
  return (
    <NavLink to={to} end={end} onClick={onNavigate}>
      {({ isActive }) => (
        <motion.div
          whileTap={{ scale: 0.97 }}
          className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all relative group cursor-pointer
            ${
              isActive
                ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/40"
                : "text-white/40 hover:bg-white/[0.05] hover:text-white/70"
            }`}
        >
          <span
            className={`text-[17px] flex-shrink-0 ${isActive ? "text-white" : "text-white/40 group-hover:text-white/70"}`}
          >
            {icon}
          </span>
          <span className="truncate">{label}</span>
          {isActive && (
            <RiArrowRightSLine className="ml-auto text-white/50 text-base" />
          )}
        </motion.div>
      )}
    </NavLink>
  );
}

function DropdownNav({ item, location, openMenu, setOpenMenu, onNavigate }) {
  const isParentActive = item.children.some((child) =>
    location.pathname.startsWith(child.path),
  );
  const isOpen = openMenu === item.label || isParentActive;

  return (
    <div>
      <button
        type="button"
        onClick={() =>
          setOpenMenu((prev) => (prev === item.label ? null : item.label))
        }
        className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-medium transition-all
          ${
            isParentActive
              ? "bg-blue-600 text-white font-semibold shadow-md shadow-blue-900/40"
              : "text-white/40 hover:bg-white/[0.05] hover:text-white/70"
          }`}
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-[17px] flex-shrink-0">{item.icon}</span>
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
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-52 opacity-100 mt-1" : "max-h-0 opacity-0"
        }`}
      >
        <div className="ml-4 pl-3 border-l border-white/10 space-y-0.5 py-1">
          {item.children.map((child) => (
            <NavLink
              key={child.path}
              to={child.path}
              end={["/admin/doctors", "/admin/labs", "/admin/scans"].includes(
                child.path,
              )}
              onClick={onNavigate}
              className={({ isActive }) =>
                `flex items-center h-9 px-3 rounded-lg text-[12px] transition-all ${
                  isActive
                    ? "bg-blue-600/30 text-white font-semibold"
                    : "text-white/40 hover:bg-white/[0.05] hover:text-white/70"
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
}

const NAV_ITEMS = [
  { path: "/admin/dashboard", label: "Dashboard", icon: <MdDashboard /> },
  {
    label: "Doctors",
    icon: <MdLocalHospital />,
    children: [
      { path: "/admin/doctors", label: "All Doctors" },
      { path: "/admin/doctors/new", label: "New Doctors" },
    ],
  },
  { path: "/admin/patients", label: "Patients", icon: <MdPeople /> },
  {
    label: "Labs",
    icon: <MdScience />,
    children: [
      { path: "/admin/labs", label: "All Labs" },
      { path: "/admin/labs/new", label: "New Labs" },
    ],
  },
  {
    label: "Scans",
    icon: <MdMedicalServices />,
    children: [
      { path: "/admin/scans", label: "All Scans" },
      { path: "/admin/scans/new", label: "New Scans" },
    ],
  },
  {
    path: "/admin/complaints",
    label: "Moderation",
    icon: <MdReportProblem />,
  },
  {
    label: "Master Data",
    icon: <MdScience />,
    children: [
      { path: "/admin/majors", label: "Majors" },
      { path: "/admin/allergies", label: "Allergies" },
      { path: "/admin/chronic-diseases", label: "Chronic Diseases" },
    ],
  },
];

const PAGE_TITLES = {
  dashboard: { t: "Dashboard", s: "Platform overview & analytics" },
  doctors: { t: "Doctors", s: "Manage doctor accounts & approvals" },
  patients: { t: "Patients", s: "Manage patient accounts" },
  labs: { t: "Labs", s: "Lab provider management" },
  scans: { t: "Scans", s: "Imaging center management" },
  complaints: { t: "Moderation", s: "Complaints & content reports" },
  majors: { t: "Majors", s: "Medical specialties" },
  allergies: { t: "Allergies", s: "Allergy master data" },
  "chronic-diseases": {
    t: "Chronic Diseases",
    s: "Chronic disease master data",
  },
};

export default function AdminLayout() {
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [openMenu, setOpenMenu] = useState(null);
  const logoutMutation = useLogout();
  const mainRef = useRef(null);

  const adminName = (() => {
    if (!accessToken) return "Admin";
    try {
      const payload = JSON.parse(atob(accessToken.split(".")[1]));
      return payload.name || payload.email?.split("@")[0] || "Admin";
    } catch {
      return "Admin";
    }
  })();

  useEffect(() => {
    if (mainRef.current) mainRef.current.scrollTo({ top: 0 });
  }, [location.pathname]);

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const handleLogout = () => {
    logoutMutation.mutate(undefined, {
      onSuccess: () => navigate("/auth/Login"),
    });
  };

  const closeMobile = () => setMobileOpen(false);

  useScrollToTop();

  const sidebarContent = (
    <>
      <div className="px-5 pt-6 pb-5 border-b border-white/[0.06] flex items-center gap-3">
        <img src={Icon} alt="Dactra" className="w-9 h-9 rounded-lg" />
        <div>
          <p className="text-white font-extrabold text-[15px] tracking-tight leading-tight">
            Dactra Admin
          </p>
          <p className="text-white/30 text-[11px] mt-0.5">Control Center</p>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) =>
          item.children ? (
            <DropdownNav
              key={item.label}
              item={item}
              location={location}
              openMenu={openMenu}
              setOpenMenu={setOpenMenu}
              onNavigate={closeMobile}
            />
          ) : (
            <NavItem
              key={item.path}
              to={item.path}
              label={item.label}
              icon={item.icon}
              onNavigate={closeMobile}
            />
          ),
        )}
      </nav>

      <div className="px-3 pb-5 flex flex-col gap-2 border-t border-white/[0.06] pt-3">
        <motion.button
          whileHover={{ x: -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-white/40 hover:bg-white/[0.05] hover:text-white/70 transition-all"
        >
          <RiArrowLeftLine className="text-[17px]" />
          <span>Back to Home</span>
        </motion.button>
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-red-400/90 hover:bg-red-500/10 hover:text-red-300 transition-all"
        >
          <MdLogout className="text-[17px]" />
          <span>Log Out</span>
        </button>
        <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3 mt-1">
          <p className="text-white/30 text-[10px] leading-relaxed">
            Manage providers, review reports, and keep the platform safe.
          </p>
        </div>
      </div>
    </>
  );

  const pathKey =
    Object.keys(PAGE_TITLES).find((k) => location.pathname.includes(k)) ||
    "dashboard";
  const { t: pageTitle, s: pageSubtitle } =
    PAGE_TITLES[pathKey] || PAGE_TITLES.dashboard;

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-[#F0F4FA]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex w-60 flex-shrink-0 flex-col bg-[#06172E] relative overflow-hidden">
        <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-white/[0.025] pointer-events-none" />
        <div className="absolute top-32 -right-10 w-36 h-36 rounded-full bg-blue-500/10 pointer-events-none" />
        {sidebarContent}
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-black/50 lg:hidden"
              onClick={closeMobile}
            />
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#06172E] overflow-hidden lg:hidden"
            >
              <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-white/[0.025] pointer-events-none" />
              <button
                onClick={closeMobile}
                className="absolute top-4 right-4 z-10 text-white/40 hover:text-white"
                aria-label="Close menu"
              >
                <MdClose className="text-xl" />
              </button>
              {sidebarContent}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-4 lg:px-8 py-3 lg:py-4 flex items-center gap-3 shadow-sm shrink-0">
          <button
            onClick={() => setMobileOpen(true)}
            className="lg:hidden text-slate-500 hover:text-slate-800 transition-colors"
            aria-label="Open menu"
          >
            <MdMenu className="text-xl" />
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-lg lg:text-xl font-black tracking-tight text-[#06172E] truncate">
              {pageTitle}
            </h1>
            <p className="text-[11px] lg:text-[12px] text-slate-400 font-medium truncate">
              {pageSubtitle}
            </p>
          </div>
          <div className="flex items-center gap-2.5 shrink-0">
            <NotificationBell />
            <div className="hidden sm:block text-right ml-2">
              <p className="text-sm font-semibold text-gray-800 leading-none">
                {adminName}
              </p>
              <p className="text-[11px] text-gray-400 mt-0.5">Administrator</p>
            </div>
            <div className="w-9 h-9 rounded-full bg-[#316BE8] flex items-center justify-center text-white font-bold text-sm shadow-md shadow-blue-200">
              {adminName[0].toUpperCase()}
            </div>
          </div>
        </header>

        <main
          ref={mainRef}
          className="flex-1 overflow-y-auto px-4 lg:px-8 py-5 lg:py-7"
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0, transition: { duration: 0.2 } }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
