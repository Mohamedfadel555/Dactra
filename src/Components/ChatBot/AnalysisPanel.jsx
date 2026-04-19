import { useRef, useState } from "react";
import { GoPaperclip } from "react-icons/go";
import { HiOutlineDocumentText, HiXMark } from "react-icons/hi2";
import { TbHeartRateMonitor } from "react-icons/tb";
import { motion } from "framer-motion";

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

export default function AnalysisPanel({ onSend }) {
  const [dragOver, setDragOver] = useState(false);
  const [files, setFiles] = useState([]);
  const [note, setNote] = useState("");
  const fileRef = useRef(null);

  const processFiles = async (rawFiles) => {
    const processed = [];
    for (const f of rawFiles) {
      const mime = getMimeType(f);
      if (!ALLOWED_MIME.includes(mime) || f.size > 20 * 1024 * 1024) continue;
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
    setFiles((prev) => [...prev, ...processed]);
  };

  const removeFile = (idx) => {
    setFiles((prev) => {
      const updated = [...prev];
      if (updated[idx].preview) URL.revokeObjectURL(updated[idx].preview);
      updated.splice(idx, 1);
      return updated;
    });
  };

  const handleSend = () => {
    if (files.length === 0) return;
    const msg =
      note.trim() ||
      (files.length === 1 && files[0].type === "pdf"
        ? "Please analyze this medical report and explain each value in simple language."
        : "Please analyze these medical files and share your detailed observations.");
    onSend(msg, files);
    setFiles([]);
    setNote("");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex-1 flex flex-col gap-4 px-4 md:px-6 py-6 overflow-y-auto"
    >
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow">
          <TbHeartRateMonitor size={24} color="white" />
        </div>
        <div>
          <h2 className="text-[16px] font-extrabold text-blue-900">
            Medical Analysis
          </h2>
          <p className="text-[11px] text-slate-400">
            Powered by Gemini · Scans, labs, and reports
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-2 bg-emerald-50 border border-emerald-100 rounded-xl">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
        <p className="text-[12px] text-emerald-700 font-semibold">
          Dactra · Advanced medical analysis
        </p>
      </div>
      <div className="grid grid-cols-2 gap-2">
        {[
          {
            label: "X-Ray / MRI",
            color: "bg-blue-50 text-blue-600 border-blue-100",
          },
          {
            label: "CT Scan",
            color: "bg-purple-50 text-purple-600 border-purple-100",
          },
          {
            label: "Blood Tests",
            color: "bg-emerald-50 text-emerald-600 border-emerald-100",
          },
          {
            label: "PDF Reports",
            color: "bg-red-50 text-red-500 border-red-100",
          },
        ].map((t) => (
          <div
            key={t.label}
            className={`flex items-center gap-2 px-3 py-2 rounded-xl border text-[12px] font-semibold ${t.color}`}
          >
            <span className="w-1.5 h-1.5 rounded-full bg-current" />
            {t.label}
          </div>
        ))}
      </div>
      <motion.div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer.files.length > 0)
            processFiles(Array.from(e.dataTransfer.files));
        }}
        onClick={() => fileRef.current?.click()}
        animate={{
          borderColor: dragOver ? "#10b981" : "#a7f3d0",
          backgroundColor: dragOver ? "#f0fdf4" : "#f9fffe",
        }}
        className="border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all"
      >
        <div className="w-14 h-14 rounded-2xl bg-emerald-100 flex items-center justify-center">
          <GoPaperclip size={28} className="text-emerald-500" />
        </div>
        <p className="text-[14px] font-bold text-emerald-800">
          Drag files here or click to upload
        </p>
        <p className="text-[11px] text-slate-400">
          JPG · PNG · WEBP · PDF — Max 20MB each · Multiple files supported
        </p>
        <input
          ref={fileRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          className="hidden"
          onChange={(e) =>
            e.target.files.length > 0 &&
            processFiles(Array.from(e.target.files))
          }
        />
      </motion.div>
      {files.length > 0 && (
        <div className="flex flex-col gap-2">
          {files.map((file, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="border border-emerald-200 rounded-2xl p-3 bg-emerald-50 flex items-center gap-3"
            >
              {file.type === "image" ? (
                <img
                  src={file.preview}
                  alt={file.name}
                  className="w-14 h-14 object-cover rounded-xl border border-emerald-200 flex-shrink-0"
                />
              ) : (
                <div className="w-14 h-14 bg-white rounded-xl border border-red-200 flex items-center justify-center flex-shrink-0">
                  <HiOutlineDocumentText size={26} className="text-red-500" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-[12px] font-bold text-emerald-800 truncate">
                  {file.name}
                </p>
                <p className="text-[10px] text-emerald-500 mt-0.5">
                  {file.type === "pdf" ? "PDF Report" : "Medical Image"} — Ready
                </p>
              </div>
              <button
                onClick={() => removeFile(idx)}
                className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center border-none cursor-pointer flex-shrink-0"
              >
                <HiXMark className="w-3.5 h-3.5 text-red-500" />
              </button>
            </motion.div>
          ))}
        </div>
      )}
      <div className="flex flex-col gap-1.5">
        <label className="text-[12px] font-semibold text-slate-500">
          Additional note (optional)
        </label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="e.g. I'm 35 years old, I have pain on my right side..."
          rows={3}
          className="w-full border border-emerald-200 rounded-xl px-4 py-3 text-[13px] text-slate-700 outline-none focus:border-emerald-400 resize-none bg-white"
        />
      </div>
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleSend}
        disabled={files.length === 0}
        className="w-full py-3.5 bg-gradient-to-r from-emerald-400 to-teal-500 text-white font-bold text-[14px] rounded-2xl border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-200 flex items-center justify-center gap-2"
      >
        <TbHeartRateMonitor size={18} />
        {files.length > 1
          ? `Start Analysis (${files.length} files)`
          : "Start Analysis"}
      </motion.button>
      <p className="text-center text-[11px] text-slate-300">
        For informational purposes only — does not replace a doctor's opinion.
      </p>
    </motion.div>
  );
}
