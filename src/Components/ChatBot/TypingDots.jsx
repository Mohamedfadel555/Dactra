import { motion } from "framer-motion";
import { HiSignal } from "react-icons/hi2";
import Logo from "../../assets/images/icons/dactraIcon.webp";
export default function TypingDots({ retrying, isAnalysis }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      className="flex items-start gap-2.5"
    >
      <img src={Logo} alt="Logo" className="size-[30px]" />
      <div className="bg-white border border-blue-100 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm min-w-fit">
        {retrying ? (
          <div className="flex items-center gap-2">
            <HiSignal className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
            <p className="text-[12px] text-amber-500 font-semibold">
              {isAnalysis ? "Switching model..." : "Rate limit — retrying..."}
            </p>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              {[0, 0.18, 0.36].map((d, i) => (
                <motion.span
                  key={i}
                  animate={{ scale: [0.6, 1, 0.6], opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.1, repeat: Infinity, delay: d }}
                  className={`w-1.5 h-1.5 rounded-full block ${isAnalysis ? "bg-emerald-400" : "bg-blue-400"}`}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
