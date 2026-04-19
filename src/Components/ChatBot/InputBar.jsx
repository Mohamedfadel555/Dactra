import { AnimatePresence, motion } from "framer-motion";
import { useRef, useState } from "react";
import { GoPaperclip } from "react-icons/go";
import { HiOutlineDocumentText, HiXMark } from "react-icons/hi2";
import { IoWarningOutline } from "react-icons/io5";
import { LuSendHorizontal } from "react-icons/lu";

function detectLanguage(text = "") {
  return /[\u0600-\u06FF]/.test(text) ? "ar" : "en";
}

const fileToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result.split(",")[1]);
    r.onerror = reject;
    r.readAsDataURL(file);
  });

function getMimeType(file) {
  if (file.type) return file.type;
  const map = {
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    pdf: "application/pdf",
  };
  return map[file.name.split(".").pop().toLowerCase()] || "image/jpeg";
}
const ALLOWED_MIME = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
];

export default function InputBar({ onSend, disabled, lang }) {
  const [text, setText] = useState("");
  const [pendingFiles, setPendingFiles] = useState([]);
  const [toast, setToast] = useState(null);
  const inputRef = useRef(null);
  const fileRef = useRef(null);
  const isRtl = (lang || detectLanguage(text)) === "ar";

  const showToast = (msg, isError = false) => {
    setToast({ msg, isError });
    setTimeout(() => setToast(null), 2500);
  };

  const handleFileChange = async (e) => {
    const selected = Array.from(e.target.files);
    if (!selected.length) return;
    const processed = [];
    for (const f of selected) {
      if (f.size > 20 * 1024 * 1024) {
        showToast("File exceeds 20MB limit", true);
        continue;
      }
      const mime = getMimeType(f);
      if (!ALLOWED_MIME.includes(mime)) {
        showToast("Unsupported file type", true);
        continue;
      }
      const base64 = await fileToBase64(f);
      const preview =
        mime !== "application/pdf" ? URL.createObjectURL(f) : null;
      processed.push({
        base64,
        mimeType: mime,
        preview,
        name: f.name,
        type: mime === "application/pdf" ? "pdf" : "image",
      });
    }
    if (processed.length > 0) {
      setPendingFiles((prev) => [...prev, ...processed]);
      showToast(`${processed.length} file(s) ready`);
    }
    e.target.value = "";
  };

  const removeFile = (idx) => {
    setPendingFiles((prev) => {
      const updated = [...prev];
      if (updated[idx].preview) URL.revokeObjectURL(updated[idx].preview);
      updated.splice(idx, 1);
      return updated;
    });
  };

  const handleSend = () => {
    const t = text.trim();
    if ((!t && pendingFiles.length === 0) || disabled) return;
    const msg =
      t ||
      (pendingFiles.length === 1 && pendingFiles[0].type === "pdf"
        ? "Please analyze this medical report."
        : "Please analyze these medical files.");
    onSend(msg, pendingFiles.length > 0 ? pendingFiles : null);
    setText("");
    setPendingFiles([]);
    inputRef.current?.focus();
  };

  const hasFiles = pendingFiles.length > 0;

  return (
    <div
      className="px-4 md:px-5 pb-4 flex-shrink-0"
      dir={isRtl ? "rtl" : "ltr"}
    >
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-2 flex items-center justify-center gap-2 text-[12px] font-semibold rounded-xl py-2 border ${toast.isError ? "text-red-600 bg-red-50 border-red-100" : "text-blue-600 bg-blue-50 border-blue-100"}`}
          >
            {toast.isError ? (
              <IoWarningOutline className="w-3.5 h-3.5" />
            ) : (
              <GoPaperclip className="w-3.5 h-3.5" />
            )}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {hasFiles && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-2 flex flex-wrap gap-2 p-2 bg-emerald-50 border border-emerald-200 rounded-xl"
          >
            {pendingFiles.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 bg-white border border-emerald-200 rounded-xl px-2 py-1.5"
              >
                {f.type === "image" ? (
                  <img
                    src={f.preview}
                    alt={f.name}
                    className="w-8 h-8 object-cover rounded-lg flex-shrink-0"
                  />
                ) : (
                  <div className="w-8 h-8 bg-red-50 border border-red-200 rounded-lg flex items-center justify-center flex-shrink-0">
                    <HiOutlineDocumentText className="w-4 h-4 text-red-500" />
                  </div>
                )}
                <p className="text-[11px] font-semibold text-emerald-700 truncate max-w-[100px]">
                  {f.name}
                </p>
                <button
                  onClick={() => removeFile(idx)}
                  className="w-5 h-5 rounded-full bg-emerald-200 flex items-center justify-center border-none cursor-pointer flex-shrink-0"
                >
                  <HiXMark className="w-3 h-3 text-emerald-700" />
                </button>
              </div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 260, damping: 24 }}
        className={`bg-white rounded-2xl shadow-lg transition-all border-2 ${hasFiles ? "border-emerald-300 shadow-emerald-100/40 focus-within:border-emerald-400" : "border-blue-200 shadow-blue-100/40 focus-within:border-blue-400"}`}
      >
        <div className="flex items-center gap-2.5 px-4 py-3.5">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => fileRef.current?.click()}
            disabled={disabled}
            title="Upload images or PDFs"
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border cursor-pointer transition-colors ${hasFiles ? "bg-emerald-100 border-emerald-300" : "border-blue-100 bg-transparent"} disabled:opacity-40`}
          >
            <GoPaperclip
              className={`w-4 h-4 ${hasFiles ? "text-emerald-500" : "text-slate-400"}`}
            />
          </motion.button>
          <input
            ref={fileRef}
            type="file"
            multiple
            accept="image/*,.pdf"
            onChange={handleFileChange}
            className="hidden"
          />
          <input
            ref={inputRef}
            value={text}
            onChange={(e) => setText(e.target.value.slice(0, 1500))}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSend();
              }
            }}
            placeholder={
              hasFiles
                ? "Add a note or send for analysis..."
                : "Ask a medical question or upload a file..."
            }
            dir={isRtl ? "rtl" : "ltr"}
            className="flex-1 border-none outline-none text-[13.5px] text-slate-700 bg-transparent placeholder-slate-300 font-medium"
          />
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleSend}
            disabled={(!text.trim() && pendingFiles.length === 0) || disabled}
            className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 border-none cursor-pointer disabled:opacity-40 shadow-md ${hasFiles ? "bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-200" : "bg-blue-500 shadow-blue-200"}`}
          >
            <LuSendHorizontal
              className={`w-3.5 h-3.5 text-white ${isRtl ? "rotate-180" : ""}`}
            />
          </motion.button>
        </div>
        <p className="px-4 pb-2.5 text-[10px] text-slate-300">
          {hasFiles
            ? `${pendingFiles.length} file(s) attached · Powered by Gemini`
            : "Chat · Analysis · X-Ray · MRI · Blood Tests · PDF · Skin conditions · Powered by Gemini"}
        </p>
      </motion.div>
      <p className="text-center text-[11px] text-slate-300 mt-2">
        Dactra provides general medical information only — not a substitute for
        professional medical advice.
      </p>
    </div>
  );
}
