import { useEffect, useRef } from "react";
import { FiEdit2, FiFlag, FiTrash2 } from "react-icons/fi";
import { motion } from "framer-motion";

export default function PostMenu({
  isOwner,
  onEdit,
  onDelete,
  onReport,
  onClose,
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const items = isOwner
    ? [
        {
          icon: FiEdit2,
          label: "Edit post",
          onClick: onEdit,
          color: "text-slate-600",
        },
        {
          icon: FiTrash2,
          label: "Delete post",
          onClick: onDelete,
          color: "text-rose-500",
        },
      ]
    : [
        {
          icon: FiFlag,
          label: "Report post",
          onClick: onReport,
          color: "text-amber-500",
        },
      ];

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -6 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-8 z-100 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 py-1.5 min-w-[160px] overflow-hidden"
    >
      {items.map((item, i) => (
        <motion.button
          key={i}
          whileHover={{ backgroundColor: "rgba(241,245,249,1)" }}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold border-none bg-transparent cursor-pointer transition-colors ${item.color}`}
        >
          <item.icon size={14} />
          {item.label}
        </motion.button>
      ))}
    </motion.div>
  );
}
