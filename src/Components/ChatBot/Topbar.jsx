import { motion } from "framer-motion";
import { HiBars3, HiPlus } from "react-icons/hi2";

const PAGE_TITLES = {
  chat: { label: "Medical Assistant", sub: "Powered by Gemini" },
  analysis: {
    label: "Medical Analysis",
    sub: "Powered by Gemini · Scans · Labs · PDFs",
  },
};

export default function Topbar({ activeNav, onNewChat, onMenuToggle }) {
  const t = PAGE_TITLES[activeNav] || PAGE_TITLES.chat;
  const isAnalysis = activeNav === "analysis";
  return (
    <motion.div
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.1, type: "spring", stiffness: 260, damping: 24 }}
      className="flex items-center justify-between px-4 md:px-5 py-3 bg-white border-b border-blue-100 flex-shrink-0 gap-3"
    >
      <div className="flex items-center gap-3">
        <motion.button
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.94 }}
          onClick={onMenuToggle}
          className="lg:hidden text-slate-500 cursor-pointer bg-transparent border-none p-1"
        >
          <HiBars3 className="w-5 h-5" />
        </motion.button>
        <div>
          <h1 className="text-[15px] md:text-[16px] font-extrabold text-blue-900 leading-tight">
            {t.label}
          </h1>
          <p className="text-[10px] text-slate-400">{t.sub}</p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <div
          className={`hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-[11px] font-semibold border ${isAnalysis ? "bg-emerald-50 border-emerald-100 text-emerald-600" : "bg-blue-50 border-blue-100 text-blue-600"}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full animate-pulse inline-block ${isAnalysis ? "bg-emerald-400" : "bg-blue-400"}`}
          />
          {isAnalysis ? "Analysis Mode" : "Chat Mode"}
        </div>
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.95 }}
          onClick={onNewChat}
          className="flex items-center gap-1.5 px-3 md:px-4 py-1.5 md:py-2 bg-blue-500 text-white text-[12px] md:text-[13px] font-bold rounded-xl border-none cursor-pointer shadow-md shadow-blue-200"
        >
          <HiPlus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New Chat</span>
          <span className="sm:hidden">New</span>
        </motion.button>
      </div>
    </motion.div>
  );
}
