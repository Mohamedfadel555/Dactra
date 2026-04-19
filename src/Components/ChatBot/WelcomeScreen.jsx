import { motion } from "framer-motion";

import Logo from "../../assets/images/icons/dactraIcon.webp";
import { MdOutlineHealthAndSafety } from "react-icons/md";
import { TbHeartRateMonitor } from "react-icons/tb";
import { HiOutlineDocumentText } from "react-icons/hi2";
import { FaRegQuestionCircle } from "react-icons/fa";
const SUGGESTION_CARDS = [
  {
    icon: <MdOutlineHealthAndSafety size={22} className="text-blue-500" />,
    color: "bg-blue-50",
    title: "Ask about symptoms",
    desc: "Describe what you feel and get clear medical information.",
    prompt: "What does persistent headache with dizziness mean?",
    nav: null,
  },
  {
    icon: <TbHeartRateMonitor size={22} className="text-emerald-500" />,
    color: "bg-emerald-50",
    title: "Analyze lab results",
    desc: "Upload your blood test and get a simple explanation.",
    prompt: null,
    nav: "analysis",
  },
  {
    icon: <HiOutlineDocumentText size={20} className="text-violet-500" />,
    color: "bg-violet-50",
    title: "Analyze a scan",
    desc: "Upload an X-ray or scan image for observations.",
    prompt: null,
    nav: "analysis",
  },
  {
    icon: <FaRegQuestionCircle size={18} className="text-amber-500" />,
    color: "bg-amber-50",
    title: "About Dactra",
    desc: "What is Dactra and how can it help you?",
    prompt: "What is Dactra and what kind of information can I find here?",
    nav: null,
  },
];
const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { type: "spring", stiffness: 280, damping: 26, delay },
});

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
};
export default function WelcomeScreen({ onQuickAsk, setActiveNav }) {
  return (
    <motion.div
      key="welcome"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.2 }}
      className="flex-1 flex flex-col items-center justify-center px-5 pb-4 pt-4"
    >
      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="relative mb-5"
      >
        <motion.div
          animate={{ scale: [1, 1.5, 1], opacity: [0.25, 0, 0.25] }}
          transition={{ duration: 4, repeat: Infinity }}
          className="absolute inset-0 rounded-full bg-blue-300"
          style={{ filter: "blur(18px)", transform: "scale(1.3)" }}
        />
        <img src={Logo} className="size-[70px]" alt="Dactra logo" />
      </motion.div>
      <motion.h1
        {...fadeUp(0.1)}
        className="text-2xl sm:text-[28px] font-extrabold text-blue-900 tracking-tight mb-2 text-center"
      >
        Welcome to <span className="text-blue-500">Dactra</span>
      </motion.h1>
      <motion.p
        {...fadeUp(0.18)}
        className="text-[13px] text-slate-400 text-center leading-relaxed mb-2 max-w-sm"
      >
        Ask any medical question or upload your scans and lab results for
        instant AI analysis.
      </motion.p>
      <motion.div {...fadeUp(0.22)} className="flex items-center gap-3 mb-6">
        <span className="text-[11px] text-slate-400 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 inline-block" />{" "}
          Powered by Gemini
        </span>
      </motion.div>
      <motion.div
        variants={stagger}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full max-w-2xl"
      >
        {SUGGESTION_CARDS.map((c) => (
          <motion.button
            key={c.title}
            variants={{
              hidden: { opacity: 0, y: 16, scale: 0.96 },
              show: {
                opacity: 1,
                y: 0,
                scale: 1,
                transition: { type: "spring", stiffness: 280, damping: 24 },
              },
            }}
            whileHover={{
              y: -4,
              boxShadow: "0 8px 24px rgba(26,109,212,0.14)",
              borderColor: "#93c5fd",
            }}
            whileTap={{ scale: 0.97 }}
            onClick={() => (c.nav ? setActiveNav(c.nav) : onQuickAsk(c.prompt))}
            className="bg-white border border-blue-100 rounded-2xl p-3.5 text-left cursor-pointer transition-colors"
          >
            <div
              className={`w-9 h-9 rounded-xl ${c.color} flex items-center justify-center mb-2.5`}
            >
              {c.icon}
            </div>
            <p className="text-[12px] font-bold text-blue-900 mb-1">
              {c.title}
            </p>
            <p className="text-[10.5px] text-slate-400 leading-snug">
              {c.desc}
            </p>
          </motion.button>
        ))}
      </motion.div>
    </motion.div>
  );
}
