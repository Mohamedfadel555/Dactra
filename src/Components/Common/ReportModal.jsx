import { useEffect, useState } from "react";
import { reportReasons } from "../../utils/reportConstants";

export default function ReportModal({
  isOpen,
  onClose,
  onSubmit,
  isSubmitting = false,
  contentLabel = "content",
}) {
  const [reason, setReason] = useState(reportReasons[0]);
  const [details, setDetails] = useState("");

  useEffect(() => {
    if (!isOpen) return;
    setReason(reportReasons[0]);
    setDetails("");
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit?.({ reason, details: details.trim() });
  };

  return (
    <div className="fixed inset-0 z-[120] bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-slate-100">
        <div className="px-5 py-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800">Report {contentLabel}</h3>
          <p className="text-xs text-slate-500 mt-1">This is a report only, not delete.</p>
        </div>
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">
              Reason
            </label>
            <div className="space-y-2">
              {reportReasons.map((item) => (
                <label key={item} className="flex items-center gap-2 text-sm text-slate-700">
                  <input
                    type="radio"
                    name="reportReason"
                    value={item}
                    checked={reason === item}
                    onChange={() => setReason(item)}
                  />
                  {item}
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Optional text
            </label>
            <textarea
              value={details}
              onChange={(e) => setDetails(e.target.value)}
              placeholder="اكتب السبب"
              className="w-full min-h-[90px] border border-slate-200 rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-[#316BE8] focus:border-transparent outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-1">
            <button
              type="button"
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-medium border border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg text-sm font-semibold bg-[#316BE8] text-white hover:bg-[#2552c1] disabled:opacity-60"
            >
              {isSubmitting ? "Sending..." : "Submit Report"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
