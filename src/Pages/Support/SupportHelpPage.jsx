import { Link } from "react-router-dom";

export default function SupportHelpPage() {
  return (
    <div className="pt-[90px] px-4 pb-10 min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl border border-slate-100 shadow-sm p-6 space-y-5">
        <h1 className="text-2xl font-bold text-slate-800">Support / Help</h1>
        <p className="text-sm text-slate-600">
          Use this page for system issues, bugs, or any help request that is not
          directly tied to a specific person.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2">
          <h2 className="font-semibold text-slate-700">Examples</h2>
          <ul className="text-sm text-slate-600 list-disc pl-5 space-y-1">
            <li>App bug or broken page</li>
            <li>Booking or scheduling issue</li>
            <li>General system performance problem</li>
          </ul>
        </div>

        <Link
          to="/complaints/submit"
          state={{ against: "System" }}
          className="inline-flex px-4 py-2.5 rounded-xl bg-[#316BE8] text-white text-sm font-semibold hover:bg-[#2552c1]"
        >
          Submit System Complaint
        </Link>
      </div>
    </div>
  );
}
