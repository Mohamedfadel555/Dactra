import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiX, FiSend } from "react-icons/fi";
import Spinner from "./Spinner";

/**
 * EditModal
 * Props:
 *   isOpen       – boolean
 *   onClose      – () => void
 *   initialText  – string (current content)
 *   onSave       – (newContent: string) => void
 *   isPending    – boolean (mutation loading state)
 *   title        – string  e.g. "Edit Question" | "Edit Comment"
 */
export default function EditModal({
  isOpen,
  onClose,
  initialText = "",
  onSave,
  isPending = false,
  title = "Edit",
}) {
  const [text, setText] = useState(initialText);
  const textareaRef = useRef(null);

  // sync when modal opens with fresh content
  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [isOpen, initialText]);

  // close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  const handleSave = () => {
    const trimmed = text.trim();
    if (!trimmed || trimmed === initialText.trim()) return;
    onSave(trimmed);
  };

  const hasChanged = text.trim() !== initialText.trim() && text.trim() !== "";

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-50 bg-black/30 backdrop-blur-[2px]"
          />

          {/* Modal */}
          <motion.div
            key="modal"
            initial={{ opacity: 0, scale: 0.94, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 24 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed inset-0 z-50 flex items-center justify-center px-4 pointer-events-none"
          >
            <div
              className="bg-white rounded-2xl shadow-2xl shadow-slate-300/40 w-full max-w-lg pointer-events-auto overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
              <div className="flex items-center justify-between px-5 pt-4 pb-3 border-b border-slate-100">
                <h2 className="text-[15px] font-bold text-slate-800">
                  {title}
                </h2>
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={onClose}
                  className="p-1.5 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <FiX size={16} />
                </motion.button>
              </div>

              {/* Body */}
              <div className="px-5 py-4">
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !e.shiftKey && e.ctrlKey) {
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                  rows={5}
                  placeholder="Write your content…"
                  className="w-full resize-none bg-blue-50/50 border border-blue-100 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-xl px-4 py-3 text-[14px] text-slate-700 placeholder-slate-300 outline-none leading-relaxed transition-all"
                />
                <p className="text-[11px] text-slate-300 mt-1.5 text-right">
                  Ctrl + Enter to save
                </p>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-end gap-2 px-5 pb-5">
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={onClose}
                  className="px-4 py-2 rounded-xl text-[13px] font-semibold text-slate-500 hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={hasChanged && !isPending ? { scale: 1.03 } : {}}
                  whileTap={hasChanged && !isPending ? { scale: 0.96 } : {}}
                  onClick={handleSave}
                  disabled={!hasChanged || isPending}
                  className={`flex items-center gap-2 px-5 py-2 rounded-xl text-[13px] font-bold transition-all border-none
                    ${
                      hasChanged && !isPending
                        ? "bg-blue-500 text-white cursor-pointer shadow-md shadow-blue-200 hover:bg-blue-600"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    }`}
                >
                  {isPending ? <Spinner size={13} /> : <FiSend size={13} />}
                  Save
                </motion.button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
