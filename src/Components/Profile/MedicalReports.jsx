import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaFilePdf,
  FaFileAlt,
  FaCloudUploadAlt,
  FaTimes,
} from "react-icons/fa";
import { IoTrashOutline } from "react-icons/io5";
import { HiExternalLink } from "react-icons/hi";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { MdOutlineDescription, MdWarningAmber } from "react-icons/md";
import {
  useGetMyReports,
  useAddReport,
  useDeleteReport,
} from "./../../hooks/useMedicalReports";

/* ─── helpers ─── */
function formatDate(iso) {
  if (!iso) return "";
  const date = new Date(iso);
  return new Date(
    date.getTime() - date.getTimezoneOffset() * 60000,
  ).toLocaleDateString(undefined, {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function ReportDetailModal({ report, onClose }) {
  const files = report.files ?? [];
  const [selectedFileId, setSelectedFileId] = useState(files[0]?.id ?? null);
  const selectedFile = files.find((f) => f.id === selectedFileId) ?? files[0];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(6px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.94, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.94, opacity: 0, y: 20 }}
        transition={{ type: "spring", stiffness: 340, damping: 28 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-5xl h-[90vh] md:h-[82vh] flex flex-col overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-4 md:px-5 py-3 md:py-4 border-b border-slate-100 flex-shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
              <FaFilePdf className="text-blue-500 text-sm" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-gray-900 truncate">
                {report.name}
              </h3>
              <p className="text-xs text-gray-400">
                {formatDate(report.uploadedAt)}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0 ml-2">
            {selectedFile && (
              <a
                href={selectedFile.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 text-xs font-semibold transition-colors"
              >
                <HiExternalLink className="text-sm" />
                Open
              </a>
            )}
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
            >
              <FaTimes className="text-slate-500 text-xs" />
            </button>
          </div>
        </div>

        <div className="flex flex-col md:flex-row flex-1 overflow-hidden">
          <div className="md:w-72 flex-shrink-0 border-b md:border-b-0 md:border-r border-slate-100 flex flex-col overflow-hidden md:max-h-full max-h-48">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-slate-100 flex-shrink-0">
              <MdOutlineDescription className="text-blue-400 text-base" />
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Summary
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-4">
              <div className="flex items-start gap-2 p-2.5 rounded-lg bg-amber-50 border border-amber-100 mb-3">
                <MdWarningAmber className="text-amber-500 text-base flex-shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-700 leading-relaxed">
                  This summary is AI-generated and may contain errors. Always
                  consult a qualified healthcare professional.
                </p>
              </div>
              {report.summary ? (
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                  {report.summary}
                </p>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-center gap-2 py-6">
                  <MdOutlineDescription className="text-slate-200 text-4xl" />
                  <p className="text-xs text-gray-400">No summary available</p>
                </div>
              )}
            </div>
          </div>

          <div className="flex-1 flex flex-col overflow-hidden bg-slate-50">
            {files.length > 1 && (
              <div className="flex items-center gap-1.5 px-3 py-2 border-b border-slate-100 bg-white overflow-x-auto flex-shrink-0">
                {files.map((f, idx) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => setSelectedFileId(f.id)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium flex-shrink-0 transition-all ${
                      selectedFileId === f.id
                        ? "bg-blue-600 text-white shadow-sm"
                        : "bg-slate-100 text-gray-500 hover:bg-slate-200"
                    }`}
                  >
                    <FaFilePdf className="text-[10px]" />
                    File {idx + 1}
                  </button>
                ))}
                {selectedFile && (
                  <a
                    href={selectedFile.fileUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="sm:hidden flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold ml-auto flex-shrink-0"
                  >
                    <HiExternalLink className="text-sm" />
                    Open
                  </a>
                )}
              </div>
            )}

            <div className="flex-1 overflow-hidden">
              {selectedFile ? (
                <iframe
                  key={selectedFile.id}
                  src={selectedFile.fileUrl}
                  title={`${report.name} - file ${selectedFile.id}`}
                  className="w-full h-full border-0"
                />
              ) : (
                <div className="flex flex-col items-center justify-center h-full gap-3 text-center">
                  <FaFilePdf className="text-slate-200 text-5xl" />
                  <p className="text-sm text-gray-400">File not available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function UploadModal({ onClose }) {
  const [name, setName] = useState("");
  const [files, setFiles] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const fileRef = useRef(null);
  const { mutate: addReport, isPending } = useAddReport();

  const handleFiles = (incoming) => {
    if (!incoming?.length) return;
    setFiles((prev) => {
      const existing = new Set(prev.map((f) => f.name + f.size));
      const newOnes = [...incoming].filter(
        (f) => !existing.has(f.name + f.size),
      );
      return [...prev, ...newOnes];
    });
  };

  const removeFile = (idx) =>
    setFiles((prev) => prev.filter((_, i) => i !== idx));

  const handleSubmit = () => {
    if (!name.trim() || files.length === 0) return;
    addReport({ name: name.trim(), files }, { onSuccess: onClose });
  };

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500/25 focus:border-blue-500 transition-all";

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5">
          <div>
            <h3 className="text-base font-bold text-gray-900">Upload Report</h3>
            <p className="text-xs text-gray-400 mt-0.5">
              PDF or image files supported
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors"
          >
            <FaTimes className="text-slate-500 text-xs" />
          </button>
        </div>
        <div className="mb-4">
          <label className="block text-xs font-semibold text-gray-500 mb-1.5 uppercase tracking-wide">
            Report Name *
          </label>
          <input
            className={inputCls}
            placeholder="e.g. Complete Blood Count"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setDragOver(false);
            handleFiles(e.dataTransfer.files);
          }}
          onClick={() => fileRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-5 flex flex-col items-center gap-2 cursor-pointer transition-all mb-3
            ${dragOver ? "border-blue-500 bg-blue-50" : files.length > 0 ? "border-green-400 bg-green-50" : "border-slate-200 hover:border-blue-400 hover:bg-blue-50/40"}`}
        >
          <input
            ref={fileRef}
            type="file"
            accept=".pdf,image/*"
            multiple
            className="hidden"
            onChange={(e) => handleFiles(e.target.files)}
          />
          <FaCloudUploadAlt
            className={`text-2xl ${files.length > 0 ? "text-green-400" : "text-blue-400"}`}
          />
          <p className="text-sm font-medium text-gray-600">
            Drop files here or <span className="text-blue-500">browse</span>
          </p>
          <p className="text-xs text-gray-400">
            PDF, JPG, PNG — multiple files allowed
          </p>
        </div>

        {files.length > 0 && (
          <div className="flex flex-col gap-1.5 mb-4 max-h-36 overflow-y-auto">
            {files.map((f, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 border border-slate-100"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <FaFilePdf className="text-blue-400 text-sm flex-shrink-0" />
                  <p className="text-xs text-gray-700 truncate">{f.name}</p>
                  <span className="text-[10px] text-gray-400 flex-shrink-0">
                    {(f.size / 1024).toFixed(1)} KB
                  </span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(idx);
                  }}
                  className="ml-2 text-gray-300 hover:text-red-400 transition-colors flex-shrink-0"
                >
                  <FaTimes className="text-xs" />
                </button>
              </div>
            ))}
          </div>
        )}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-gray-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!name.trim() || files.length === 0 || isPending}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <>
                <AiOutlineLoading3Quarters className="animate-spin text-sm" />
                Uploading…
              </>
            ) : (
              `Upload${files.length > 1 ? ` (${files.length})` : ""}`
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function DeleteModal({ report, onClose }) {
  const { mutate: deleteReport, isPending } = useDeleteReport();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.45)", backdropFilter: "blur(4px)" }}
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ type: "spring", stiffness: 380, damping: 28 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
          <IoTrashOutline className="text-red-500 text-xl" />
        </div>
        <h3 className="text-base font-bold text-gray-900 mb-1">
          Delete Report?
        </h3>
        <p className="text-sm text-gray-500 mb-5">
          "<span className="font-medium text-gray-700">{report.name}</span>"
          will be permanently removed.
        </p>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-medium text-gray-600 hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={isPending}
            onClick={() => deleteReport(report.id, { onSuccess: onClose })}
            className="flex-1 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-sm font-semibold transition-colors flex items-center justify-center gap-2"
          >
            {isPending ? (
              <AiOutlineLoading3Quarters className="animate-spin text-sm" />
            ) : (
              "Delete"
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* ─── Skeleton ─── */
function SkeletonRow() {
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl animate-pulse">
      <div className="w-9 h-9 rounded-lg bg-slate-100 flex-shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="h-3.5 bg-slate-100 rounded w-2/3" />
        <div className="h-2.5 bg-slate-100 rounded w-1/3" />
      </div>
    </div>
  );
}

export default function MedicalReports({
  readOnly = false,
  reports: externalReports,
  isLoading: externalLoading,
}) {
  const myReports = useGetMyReports();

  const reports = externalReports ?? myReports.data ?? [];
  const isLoading = externalLoading ?? myReports.isLoading;

  const [uploadOpen, setUploadOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [detailReport, setDetailReport] = useState(null);

  const containerVariants = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.07 } },
  };

  const rowVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 300, damping: 24 },
    },
    exit: { opacity: 0, x: -20, transition: { duration: 0.2 } },
  };

  return (
    <>
      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-slate-100">
          <div>
            <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-0.5">
              Medical Reports
            </p>
            {!isLoading && (
              <p className="text-xs text-gray-400">
                {reports.length} {reports.length === 1 ? "report" : "reports"}
              </p>
            )}
          </div>
          {!readOnly && (
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setUploadOpen(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold transition-colors"
            >
              <FaCloudUploadAlt className="text-sm" />
              Upload
            </motion.button>
          )}
        </div>

        {/* List */}
        <div className="p-3">
          {isLoading ? (
            <div className="flex flex-col gap-1">
              {[...Array(3)].map((_, i) => (
                <SkeletonRow key={i} />
              ))}
            </div>
          ) : reports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-3">
                <FaFileAlt className="text-blue-400 text-lg" />
              </div>
              <p className="text-sm font-medium text-gray-600 mb-0.5">
                No reports yet
              </p>
              {!readOnly && (
                <p className="text-xs text-gray-400">
                  Upload your first medical report
                </p>
              )}
            </div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col gap-1"
            >
              <AnimatePresence>
                {reports.map((report) => (
                  <motion.div
                    key={report.id}
                    variants={rowVariants}
                    exit="exit"
                    layout
                    whileHover={{ x: 3 }}
                    transition={{ type: "spring", stiffness: 300, damping: 20 }}
                    onClick={() => setDetailReport(report)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-blue-50 transition-colors cursor-pointer group"
                  >
                    {/* Left */}
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-blue-50 group-hover:bg-blue-100 flex items-center justify-center flex-shrink-0 transition-colors">
                        <FaFilePdf className="text-blue-500 text-sm" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[13px] font-semibold text-gray-800 truncate">
                          {report.name}
                        </p>
                        <p className="text-[11px] text-gray-400">
                          {formatDate(report.uploadedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                      {!readOnly && (
                        <motion.button
                          type="button"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteTarget(report);
                          }}
                          className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100"
                          title="Delete report"
                        >
                          <IoTrashOutline className="text-red-400 text-sm" />
                        </motion.button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {!readOnly && uploadOpen && (
          <UploadModal onClose={() => setUploadOpen(false)} />
        )}
        {!readOnly && deleteTarget && (
          <DeleteModal
            report={deleteTarget}
            onClose={() => setDeleteTarget(null)}
          />
        )}
        {detailReport && (
          <ReportDetailModal
            report={detailReport}
            onClose={() => setDetailReport(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
