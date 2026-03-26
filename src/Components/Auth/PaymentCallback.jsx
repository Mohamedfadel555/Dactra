// src/pages/PaymentCallback.jsx
import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";

export default function PaymentCallback() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const success = searchParams.get("success");
    const pending = searchParams.get("pending");
    const errorOccured = searchParams.get("error_occured");

    if (success === "true" && pending === "false" && errorOccured === "false") {
      setStatus("success");
    } else {
      setStatus("failed");
    }
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500" />
      </div>
    );
  }

  if (status === "success") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-white px-4">
        <div className="bg-white rounded-2xl border border-blue-100 shadow-sm p-8 max-w-sm w-full text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-green-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h1 className="text-xl font-bold text-slate-800 mb-2">
            Payment Successful!
          </h1>
          <p className="text-sm text-slate-400 mb-1">
            Amount:{" "}
            <span className="font-semibold text-slate-600">
              {(searchParams.get("amount_cents") / 100).toFixed(2)}{" "}
              {searchParams.get("currency")}
            </span>
          </p>
          <p className="text-sm text-slate-400 mb-6">
            Transaction ID:{" "}
            <span className="font-semibold text-slate-600">
              {searchParams.get("id")}
            </span>
          </p>
          <button
            onClick={() => navigate("/")}
            className="w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold transition-colors"
          >
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-white px-4">
      <div className="bg-white rounded-2xl border border-red-100 shadow-sm p-8 max-w-sm w-full text-center">
        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg
            className="w-8 h-8 text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </div>
        <h1 className="text-xl font-bold text-slate-800 mb-2">
          Payment Failed
        </h1>
        <p className="text-sm text-slate-400 mb-6">
          {searchParams.get("data.message") ??
            "Something went wrong, please try again."}
        </p>
        <button
          onClick={() => navigate(-1)}
          className="w-full py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white text-sm font-semibold transition-colors"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
