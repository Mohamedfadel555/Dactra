import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import BrandLogo from "../Common/BrandLogo";
import { RiChatAiLine } from "react-icons/ri";
import { TbHeartRateMonitor } from "react-icons/tb";
const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
const staggerItem = {
  hidden: { opacity: 0, x: -12 },
  show: {
    opacity: 1,
    x: 0,
    transition: { type: "spring", stiffness: 300, damping: 28 },
  },
};

const NAV_ITEMS = [
  { id: "chat", icon: RiChatAiLine, label: "AI Assistant" },
  {
    id: "analysis",
    icon: TbHeartRateMonitor,
    label: "Medical Analysis",
    badge: "New",
  },
];

export default function Sidebar({ activeNav, setActive, open, setOpen }) {
  const [nav, setNav] = useState(activeNav);
  return (
    <>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 bg-black/30 z-20 lg:hidden"
          />
        )}
      </AnimatePresence>
      <motion.aside
        initial={{ x: -260, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ type: "spring", stiffness: 220, damping: 26 }}
        style={{ width: "216px" }}
        className={`fixed lg:relative z-30 lg:z-auto h-full flex flex-col flex-shrink-0 bg-white border-r border-blue-100 shadow-sm transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        <div className="w-fit py-[5px] px-[10px]">
          <BrandLogo size="size-[35px]" textSize="text-[20px]" />
        </div>
        <motion.nav
          variants={stagger}
          initial="hidden"
          animate="show"
          className="px-2 pt-3 pb-1"
        >
          {NAV_ITEMS.map((n) => (
            <motion.button
              key={n.id}
              variants={staggerItem}
              whileHover={{ x: 3, backgroundColor: "#eff6ff" }}
              animate={{
                x: 0,
                backgroundColor: n.id === activeNav ? "#eff6ff" : "transparent",
                color: n.id === activeNav ? "#1d4ed8" : "#64748b",
              }}
              whileTap={{ scale: 0.97 }}
              onClick={() => {
                setActive(n.id);
                setOpen(false);
                setNav(n.id);
                console.log(nav);
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-[13px] font-medium mb-0.5 cursor-pointer border-none text-left transition-colors `}
            >
              <n.icon className="w-4 h-4 flex-shrink-0" />
              {n.label}
              {n.badge && (
                <span className="ml-auto text-white text-[9px] font-bold rounded-full px-1.5 py-0.5 leading-none bg-gradient-to-r from-emerald-400 to-teal-500">
                  {n.badge}
                </span>
              )}
            </motion.button>
          ))}
        </motion.nav>
      </motion.aside>
    </>
  );
}
