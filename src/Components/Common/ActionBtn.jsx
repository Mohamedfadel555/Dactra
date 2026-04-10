import { motion } from "framer-motion";

export default function ActionBtn({
  iconActive,
  iconInactive,
  label,
  labelInActive,
  active,
  activeClass = "text-red-500",
  onClick,
  count,
}) {
  const Icon = active ? iconActive : iconInactive;
  const Label = active ? (labelInActive ? labelInActive : label) : label;
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors
        ${active ? activeClass : "text-slate-500 hover:text-blue-600"}
        hover:bg-blue-50 cursor-pointer select-none`}
    >
      <Icon size={16} />
      {count && count > 0 && count}
      {label && <span className="hidden sm:inline">{Label}</span>}
    </motion.button>
  );
}
