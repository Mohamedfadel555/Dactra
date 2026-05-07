import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiFileListLine,
  RiStarLine,
  RiGroupLine,
  RiArrowRightSLine,
  RiArrowLeftLine,
  RiMenuLine,
  RiCloseLine,
} from "react-icons/ri";
import { useGetDoctorOffersSummary } from "../hooks/useGetDoctorOffersSummary";

const NAV_ITEMS = [
  { to: "deals", label: "Deals", icon: <RiFileListLine /> },
  { to: "sponsors", label: "Sponsors", icon: <RiStarLine /> },
  { to: "patients", label: "Patients", icon: <RiGroupLine /> },
];

// ─── Shared nav link renderer ─────────────────────────────────────────────────
function NavItem({ to, label, icon, badge, collapsed = false }) {
  return (
    <NavLink key={to} to={to} end={false}>
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

          {!collapsed && <span className="truncate">{label}</span>}

          {badge && (
            <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
              {badge}
            </span>
          )}
          {isActive && !badge && !collapsed && (
            <RiArrowRightSLine className="ml-auto text-white/50 text-base" />
          )}
        </motion.div>
      )}
    </NavLink>
  );
}

// ─── Main layout ──────────────────────────────────────────────────────────────
export default function DoctorDashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const { data: summary } = useGetDoctorOffersSummary();

  const receivedCount =
    (summary?.receivedCount ?? 0) + (summary?.counterCount ?? 0);

  const sidebarContent = (collapsed = false) => (
    <>
      {/* Brand */}
      <div
        className={`${collapsed ? "px-3 pt-5 pb-4" : "px-5 pt-6 pb-5"} border-b border-white/[0.06] flex items-center gap-2`}
      >
        {!collapsed && (
          <div>
            <p className="text-white font-extrabold text-[15px] tracking-tight leading-tight">
              Sponsor Portal
            </p>
            <p className="text-white/30 text-[11px] mt-0.5">Sponsorship Hub</p>
          </div>
        )}
        {collapsed && (
          <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center mx-auto">
            <RiStarLine className="text-white text-sm" />
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
        {NAV_ITEMS.map(({ to, label, icon }) => {
          const badge =
            to === "deals" && receivedCount > 0 ? receivedCount : null;
          return (
            <NavItem
              key={to}
              to={to}
              label={label}
              icon={icon}
              badge={badge}
              collapsed={collapsed}
            />
          );
        })}
      </nav>

      {/* Back to home */}
      <div
        className={`${collapsed ? "px-3" : "px-3"} pb-5 flex flex-col gap-3`}
      >
        <motion.button
          whileHover={{ x: collapsed ? 0 : -2 }}
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/")}
          className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-[13px] font-medium text-white/40 hover:bg-white/[0.05] hover:text-white/70 transition-all group"
          title="Back to Home"
        >
          <RiArrowLeftLine className="text-[17px] flex-shrink-0 group-hover:text-white/70 transition-colors" />
          {!collapsed && <span>Back to Home</span>}
        </motion.button>

        {!collapsed && (
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
            <p className="text-white/30 text-[10px] leading-relaxed">
              Manage your lab & imaging sponsorships, track patients, and
              negotiate deals.
            </p>
          </div>
        )}
      </div>
    </>
  );

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-[#F0F4FA]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      {/* ── DESKTOP SIDEBAR (md+) ────────────────── */}
      <aside className="hidden md:flex w-56 lg:w-56 xl:w-60 flex-shrink-0 flex-col bg-[#06172E] relative overflow-hidden">
        <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-white/[0.025] pointer-events-none" />
        <div className="absolute top-32 -right-10 w-36 h-36 rounded-full bg-blue-500/10 pointer-events-none" />
        {sidebarContent(false)}
      </aside>

      {/* ── MOBILE DRAWER ────────────────────────── */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              key="backdrop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-40 bg-black/50 md:hidden"
              onClick={() => setMobileOpen(false)}
            />

            {/* Drawer */}
            <motion.aside
              key="drawer"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 320, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-64 flex flex-col bg-[#06172E] overflow-hidden md:hidden"
            >
              <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-white/[0.025] pointer-events-none" />
              <div className="absolute top-32 -right-10 w-36 h-36 rounded-full bg-blue-500/10 pointer-events-none" />

              {/* Close btn */}
              <button
                onClick={() => setMobileOpen(false)}
                className="absolute top-4 right-4 z-10 text-white/40 hover:text-white transition-colors"
              >
                <RiCloseLine className="text-xl" />
              </button>

              {sidebarContent(false)}
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* ── MAIN ─────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden min-w-0">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-4 md:px-8 py-3 md:py-4 flex items-center gap-3 shadow-sm">
          {/* Hamburger — mobile only */}
          <button
            onClick={() => setMobileOpen(true)}
            className="md:hidden text-slate-500 hover:text-slate-800 transition-colors flex-shrink-0"
            aria-label="Open menu"
          >
            <RiMenuLine className="text-xl" />
          </button>

          <div className="flex-1 min-w-0">
            <PageTitle pathname={location.pathname} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-4 md:px-8 py-5 md:py-7">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{
                opacity: 1,
                y: 0,
                transition: { duration: 0.2, ease: "easeOut" },
              }}
              exit={{ opacity: 0, y: -6, transition: { duration: 0.15 } }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>

        {/* ── MOBILE BOTTOM NAV ────────────────────── */}
        <nav className="md:hidden flex-shrink-0 bg-[#06172E] border-t border-white/[0.06] flex items-center justify-around px-2 py-2 safe-area-bottom">
          {NAV_ITEMS.map(({ to, label, icon }) => {
            const badge =
              to === "deals" && receivedCount > 0 ? receivedCount : null;
            return (
              <NavLink key={to} to={to} end={false} className="flex-1">
                {({ isActive }) => (
                  <motion.div
                    whileTap={{ scale: 0.9 }}
                    className="flex flex-col items-center gap-1 py-1.5 px-2 rounded-xl relative"
                  >
                    {isActive && (
                      <motion.div
                        layoutId="mobile-active-bg"
                        className="absolute inset-0 rounded-xl bg-blue-600"
                        transition={{
                          type: "spring",
                          stiffness: 400,
                          damping: 30,
                        }}
                      />
                    )}
                    <span
                      className={`relative text-[20px] ${isActive ? "text-white" : "text-white/40"}`}
                    >
                      {icon}
                      {badge && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                          {badge}
                        </span>
                      )}
                    </span>
                    <span
                      className={`relative text-[10px] font-semibold ${isActive ? "text-white" : "text-white/40"}`}
                    >
                      {label}
                    </span>
                  </motion.div>
                )}
              </NavLink>
            );
          })}

          {/* Home button in bottom nav */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            onClick={() => navigate("/")}
            className="flex-1 flex flex-col items-center gap-1 py-1.5 px-2 rounded-xl text-white/40"
          >
            <RiArrowLeftLine className="text-[20px]" />
            <span className="text-[10px] font-semibold">Home</span>
          </motion.button>
        </nav>
      </div>
    </div>
  );
}

function PageTitle({ pathname }) {
  const map = {
    deals: { t: "Deals", s: "Offers from labs & imaging centers" },
    sponsors: { t: "Sponsors", s: "Active labs sponsoring your practice" },
    patients: { t: "Patients", s: "Patients under your care" },
  };

  const key = Object.keys(map).find((k) => pathname.includes(k)) || "deals";
  const { t, s } = map[key];

  return (
    <>
      <h1 className="text-lg md:text-xl font-black tracking-tight text-[#06172E] truncate">
        {t}
      </h1>
      <p className="text-[11px] md:text-[12px] text-slate-400 mt-0.5 font-medium truncate">
        {s}
      </p>
    </>
  );
}
