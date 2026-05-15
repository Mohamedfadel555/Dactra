import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { FiX, FiSend, FiImage } from "react-icons/fi";
import Spinner from "./Spinner";

/**
 * EditModal
 * Props:
 *   isOpen        – boolean
 *   onClose       – () => void
 *   initialText   – string (current content)
 *   initialImage  – string | null (current imageUrl from server)
 *   onSave        – (newContent: string, newImage: File | null, removeImage: boolean) => void
 *   isPending     – boolean (mutation loading state)
 *   title         – string  e.g. "Edit Question" | "Edit Article"
 */
export default function EditModal({
  isOpen,
  onClose,
  initialText = "",
  initialImage = null,
  onSave,
  isPending = false,
  title = "Edit",
}) {
  const [text, setText] = useState(initialText);

  // newImage  → File object the user just picked (null = no new pick)
  // removeImg → user explicitly removed the existing server image
  const [newImage, setNewImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [removeImg, setRemoveImg] = useState(false);

  const textareaRef = useRef(null);
  const fileInputRef = useRef(null);

  // sync when modal opens
  useEffect(() => {
    if (isOpen) {
      setText(initialText);
      setNewImage(null);
      setPreview(null);
      setRemoveImg(false);
      setTimeout(() => textareaRef.current?.focus(), 80);
    }
  }, [isOpen, initialText]);

  // revoke object URL on unmount / change
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  // close on Escape
  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [onClose]);

  // ── image picker ──────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (preview) URL.revokeObjectURL(preview);
    setNewImage(file);
    setPreview(URL.createObjectURL(file));
    setRemoveImg(false); // user added a new one, so "remove" is irrelevant
  };

  const handleRemoveImage = () => {
    if (preview) URL.revokeObjectURL(preview);
    setNewImage(null);
    setPreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
    // if there was an original server image and user removed it, flag it
    if (initialImage) setRemoveImg(true);
  };

  // ── derived state ─────────────────────────────────────────
  const textChanged = text.trim() !== initialText.trim() && text.trim() !== "";
  const imageChanged = newImage !== null || removeImg;
  const hasChanged = textChanged || imageChanged;

  // what to show in the preview area
  const displayedPreview = preview ?? (!removeImg ? initialImage : null);

  const handleSave = () => {
    if (!hasChanged || isPending) return;
    onSave(text.trim() || initialText.trim(), newImage, removeImg);
  };

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
              {/* Header accent */}
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />

              {/* Header */}
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
              <div className="px-5 py-4 flex flex-col gap-3">
                {/* Textarea */}
                <textarea
                  ref={textareaRef}
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && e.ctrlKey && !e.shiftKey) {
                      e.preventDefault();
                      handleSave();
                    }
                  }}
                  rows={5}
                  placeholder="Write your content…"
                  className="w-full resize-none bg-blue-50/50 border border-blue-100 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-xl px-4 py-3 text-[14px] text-slate-700 placeholder-slate-300 outline-none leading-relaxed transition-all"
                />

                {/* Image preview */}
                <AnimatePresence>
                  {displayedPreview && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 8, scale: 0.97 }}
                      transition={{ duration: 0.2 }}
                      className="relative inline-block"
                    >
                      <img
                        src={displayedPreview}
                        alt="preview"
                        className="max-h-52 w-full object-cover rounded-xl border border-blue-100 shadow-sm"
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                      {/* Remove image btn */}
                      <button
                        onClick={handleRemoveImage}
                        className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1.5 transition-colors backdrop-blur-sm cursor-pointer"
                      >
                        <FiX size={12} />
                      </button>
                      {/* "new" badge when user picked a new file */}
                      {newImage && (
                        <span className="absolute bottom-2 left-2 text-[10px] font-bold bg-blue-500 text-white px-2 py-0.5 rounded-full">
                          New image
                        </span>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Image picker row */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.92 }}
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold transition-colors border cursor-pointer
                      ${
                        displayedPreview
                          ? "text-blue-600 bg-blue-50 border-blue-200"
                          : "text-slate-400 bg-slate-50 border-slate-200 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200"
                      }`}
                  >
                    <FiImage size={13} />
                    {displayedPreview ? "Change image" : "Add image"}
                  </motion.button>

                  {displayedPreview && (
                    <motion.button
                      initial={{ opacity: 0, x: -4 }}
                      animate={{ opacity: 1, x: 0 }}
                      type="button"
                      onClick={handleRemoveImage}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[12px] font-semibold text-rose-400 bg-rose-50 border border-rose-100 hover:bg-rose-100 transition-colors cursor-pointer"
                    >
                      <FiX size={13} />
                      Remove image
                    </motion.button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>

                <p className="text-[11px] text-slate-300 text-right -mt-1">
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
