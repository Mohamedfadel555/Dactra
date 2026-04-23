import { useState } from "react";
import { toast } from "react-toastify";
import { useAuth } from "../../Context/AuthContext";
import { useLocation } from "react-router-dom";
import { COMPLAINT_AGAINST } from "../../utils/reportConstants";
import { useComplaintsApi } from "../../hooks/useComplaintsApi";

const complaintTargets = ["Doctor", "Patient", "System"];

export default function SubmitComplaintPage() {
  const { accessToken } = useAuth();
  const location = useLocation();
  const { createComplaint } = useComplaintsApi();
  const defaultAgainst = complaintTargets.includes(location.state?.against)
    ? location.state.against
    : complaintTargets[0];
  const [against, setAgainst] = useState(defaultAgainst);
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!accessToken) {
      toast.warning("Please sign in.", { position: "top-center" });
      return;
    }
    if (!reason.trim()) {
      toast.warning("Reason is required.", { position: "top-center" });
      return;
    }
    if (!description.trim()) {
      toast.warning("Description is required.", { position: "top-center" });
      return;
    }
    setIsSubmitting(true);
    try {
      const againstNum = COMPLAINT_AGAINST[against] ?? 0;
      await createComplaint({
        title: reason.trim(),
        content: description.trim(),
        against: againstNum,
      });
      toast.success("Complaint submitted successfully.", {
        position: "top-center",
      });
      setReason("");
      setDescription("");
    } catch {
      toast.error("Could not submit complaint.", { position: "top-center" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="pt-[80px] pb-10 px-4 min-h-screen bg-slate-50">
      <div className="max-w-2xl mx-auto bg-white border border-slate-100 rounded-2xl shadow-sm">
        <div className="px-6 py-5 border-b border-slate-100">
          <h1 className="text-2xl font-bold text-slate-800">Submit Complaint</h1>
          <p className="text-sm text-slate-500 mt-1">
            Send a complaint to admin for review.
          </p>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Against
            </label>
            <select
              value={against}
              onChange={(e) => setAgainst(e.target.value)}
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            >
              {complaintTargets.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Reason
            </label>
            <input
              type="text"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Enter reason"
              className="w-full border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-1">
              Description
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the issue"
              className="w-full min-h-[120px] border border-slate-200 rounded-xl px-3 py-2 text-sm"
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="px-5 py-2.5 rounded-xl bg-[#316BE8] text-white text-sm font-semibold hover:bg-[#2552c1] disabled:opacity-60"
          >
            {isSubmitting ? "Submitting..." : "Submit Complaint"}
          </button>
        </form>
      </div>
    </div>
  );
}
