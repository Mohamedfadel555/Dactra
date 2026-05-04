import { useState } from "react";
import { NavLink, Outlet, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  RiFileListLine,
  RiStarLine,
  RiGroupLine,
  RiArrowRightSLine,
} from "react-icons/ri";
import { useGetDoctorOffersSummary } from "../hooks/useGetDoctorOffersSummary";

const NAV_ITEMS = [
  { to: "deals", label: "Deals", icon: <RiFileListLine /> },
  { to: "sponsors", label: "Sponsors", icon: <RiStarLine /> },
  { to: "patients", label: "Patients", icon: <RiGroupLine /> },
];

export default function DoctorDashboardLayout() {
  const location = useLocation();
  const { data: summary } = useGetDoctorOffersSummary();

  const receivedCount =
    (summary?.receivedCount ?? 0) + (summary?.counterCount ?? 0);

  return (
    <div
      className="flex h-screen w-screen overflow-hidden bg-[#F0F4FA]"
      style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
      `}</style>

      {/* ── SIDEBAR ─────────────────────────────── */}
      <aside className="w-56 flex-shrink-0 flex flex-col bg-[#06172E] relative overflow-hidden">
        {/* Decorative blobs */}
        <div className="absolute -bottom-16 -left-12 w-48 h-48 rounded-full bg-white/[0.025] pointer-events-none" />
        <div className="absolute top-32 -right-10 w-36 h-36 rounded-full bg-blue-500/10 pointer-events-none" />

        {/* Brand */}
        <div className="px-5 pt-6 pb-5 border-b border-white/[0.06]">
          <p className="text-white font-extrabold text-[15px] tracking-tight leading-tight">
            Doctor Portal
          </p>
          <p className="text-white/30 text-[11px] mt-0.5">Sponsorship Hub</p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 flex flex-col gap-1">
          {NAV_ITEMS.map(({ to, label, icon }) => {
            const isDeals = to === "deals";
            const badge = isDeals && receivedCount > 0 ? receivedCount : null;

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
                      className={`text-[17px] ${isActive ? "text-white" : "text-white/40 group-hover:text-white/70"}`}
                    >
                      {icon}
                    </span>
                    {label}
                    {badge && (
                      <span className="ml-auto bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-md shadow">
                        {badge}
                      </span>
                    )}
                    {isActive && !badge && (
                      <RiArrowRightSLine className="ml-auto text-white/50 text-base" />
                    )}
                  </motion.div>
                )}
              </NavLink>
            );
          })}
        </nav>

        {/* Bottom hint */}
        <div className="px-5 pb-5">
          <div className="rounded-xl bg-white/[0.04] border border-white/[0.06] p-3">
            <p className="text-white/30 text-[10px] leading-relaxed">
              Manage your lab & imaging sponsorships, track patients, and
              negotiate deals.
            </p>
          </div>
        </div>
      </aside>

      {/* ── MAIN ────────────────────────────────── */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top header */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/70 px-8 py-4 flex items-center gap-4 shadow-sm">
          <div className="flex-1">
            <PageTitle pathname={location.pathname} />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto px-8 py-7">
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
      </div>
    </div>
  );
}

function PageTitle({ pathname }) {
  const map = {
    deals: { t: "Deals", s: "Offers from labs & imaging centers" },
    sponsors: { t: "My Sponsors", s: "Active labs sponsoring your practice" },
    patients: { t: "Patients", s: "Patients under your care" },
  };

  const key = Object.keys(map).find((k) => pathname.includes(k)) || "deals";
  const { t, s } = map[key];

  return (
    <>
      <h1 className="text-xl font-black tracking-tight text-[#06172E]">{t}</h1>
      <p className="text-[12px] text-slate-400 mt-0.5 font-medium">{s}</p>
    </>
  );
}
