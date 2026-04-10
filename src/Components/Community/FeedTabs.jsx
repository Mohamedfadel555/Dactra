import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiBookmark, FiGrid, FiHeart, FiMessageCircle } from "react-icons/fi";
import { FaAngleDoubleUp, FaHospitalUser } from "react-icons/fa";
import { TbUserQuestion } from "react-icons/tb";

const getTabs = (type, role) => {
  const tabs = [
    { key: "all", label: "All", icon: FiGrid },
    { key: "saved", label: "Saved", icon: FiBookmark },
  ];

  if (role === "Patient" && type === "Question") {
    tabs.push({ key: "liked", label: "Interested", icon: FaAngleDoubleUp });
  } else if (type === "Artical") {
    tabs.push({ key: "liked", label: "Liked", icon: FiHeart });
  }

  if (role === "Doctor" && type === "Question") {
    tabs.push({ key: "commented", label: "Answered", icon: FiMessageCircle });
  }

  if (type === "Question" && role === "Patient") {
    tabs.push({ key: "my", label: "My Questions", icon: TbUserQuestion });
  }

  if (type === "Artical" && role === "Doctor") {
    tabs.push({ key: "my", label: "My Articals", icon: FaHospitalUser });
  }

  return tabs;
};
export default function FeedTabs({ active, onChange, counts, type, role }) {
  const TABS = getTabs(type, role);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="relative bg-white rounded-2xl border border-blue-50 shadow-sm p-1 flex gap-1 w-full overflow-hidden">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <motion.button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            whileTap={{ scale: 0.96 }}
            animate={{ flex: isMobile ? (isActive ? 3 : 1) : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className={`relative flex items-center justify-center gap-1 px-3 sm:px-4 py-2 rounded-xl
              text-xs sm:text-sm font-semibold transition-colors z-10 min-w-0 overflow-hidden
              ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-blue-500 hover:bg-blue-50"
              }`}
          >
            {isActive && (
              <motion.span
                layoutId={`feedTabPill-${type}`}
                className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-xl"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}

            <tab.icon size={14} className="relative z-10 flex-shrink-0" />

            <span className="relative z-10 hidden sm:inline whitespace-nowrap">
              {tab.label}
            </span>

            <motion.span
              className="relative z-10 sm:hidden whitespace-nowrap text-xs leading-none"
              animate={
                isActive && isMobile
                  ? { width: "auto", opacity: 1, marginLeft: 2 }
                  : { width: 0, opacity: 0, marginLeft: 0 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              style={{ overflow: "hidden", display: "inline-block" }}
            >
              {tab.label}
            </motion.span>

            {counts[tab.key] > 0 && (
              <motion.span
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                style={{ overflow: "hidden", display: "inline-block" }}
                className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none flex-shrink-0
                  ${isActive ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {counts[tab.key]}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}
