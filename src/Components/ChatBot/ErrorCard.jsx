import { BsExclamationOctagon } from "react-icons/bs";
import { HiClock, HiExclamationCircle, HiNoSymbol } from "react-icons/hi2";
import { IoWarningOutline } from "react-icons/io5";
import { PiWifiSlash } from "react-icons/pi";

const ERROR_TYPES = {
  API_KEY: "API_KEY",
  RATE_LIMIT: "RATE_LIMIT",
  TIMEOUT: "TIMEOUT",
  EMPTY: "EMPTY",
  NETWORK: "NETWORK",
  MODEL_ALL_FAILED: "MODEL_ALL_FAILED",
  UNKNOWN: "UNKNOWN",
};
export default function ErrorCard({ errorType, rawMessage, lang }) {
  const isAr = lang === "ar";
  const configs = {
    [ERROR_TYPES.API_KEY]: {
      icon: <HiNoSymbol className="w-5 h-5 text-red-500" />,
      bg: "bg-red-50 border-red-200",
      title: isAr ? "مفتاح API غير صالح" : "Invalid API Key",
      desc: isAr
        ? "مفتاح الـ API مفقود أو غير صحيح. يرجى مراجعة ملف .env والتأكد من صحة VITE_GEMINI_API_KEY."
        : "The API key is missing or invalid. Please check your .env file and ensure VITE_GEMINI_API_KEY is set correctly.",
      color: "text-red-700",
    },
    [ERROR_TYPES.RATE_LIMIT]: {
      icon: <HiClock className="w-5 h-5 text-amber-500" />,
      bg: "bg-amber-50 border-amber-200",
      title: isAr ? "تجاوز حد الطلبات" : "Rate Limit Reached",
      desc: isAr
        ? "وصلت إلى الحد الأقصى من الطلبات المسموح بها. يرجى الانتظار بضع دقائق ثم المحاولة مرة أخرى."
        : "You've hit the API rate limit. Please wait a few minutes before trying again.",
      color: "text-amber-700",
    },
    [ERROR_TYPES.TIMEOUT]: {
      icon: <HiClock className="w-5 h-5 text-orange-500" />,
      bg: "bg-orange-50 border-orange-200",
      title: isAr ? "انتهت مهلة الطلب" : "Request Timed Out",
      desc: isAr
        ? "استغرق الطلب وقتاً أطول من المتوقع. تحقق من اتصالك بالإنترنت وحاول مرة أخرى."
        : "The request took too long to complete. Check your internet connection and try again.",
      color: "text-orange-700",
    },
    [ERROR_TYPES.EMPTY]: {
      icon: <IoWarningOutline className="w-5 h-5 text-yellow-500" />,
      bg: "bg-yellow-50 border-yellow-200",
      title: isAr ? "ردّ فارغ من الذكاء الاصطناعي" : "Empty AI Response",
      desc: isAr
        ? "أرجع الذكاء الاصطناعي ردًا فارغاً. حاول إعادة صياغة سؤالك."
        : "The AI returned an empty response. Try rephrasing your question.",
      color: "text-yellow-700",
    },
    [ERROR_TYPES.NETWORK]: {
      icon: <PiWifiSlash className="w-5 h-5 text-slate-500" />,
      bg: "bg-slate-50 border-slate-200",
      title: isAr ? "خطأ في الشبكة" : "Network Error",
      desc: isAr
        ? "تعذّر الاتصال بالخادم. تحقق من اتصالك بالإنترنت."
        : "Could not connect to the server. Please check your internet connection.",
      color: "text-slate-700",
    },
    [ERROR_TYPES.MODEL_ALL_FAILED]: {
      icon: <BsExclamationOctagon className="w-5 h-5 text-red-500" />,
      bg: "bg-red-50 border-red-200",
      title: isAr ? "فشلت جميع النماذج" : "All Models Failed",
      desc: isAr
        ? "تم تجربة جميع نماذج الذكاء الاصطناعي المتاحة وفشلت جميعها."
        : "All available AI models were tried and all failed.",
      color: "text-red-700",
    },
    [ERROR_TYPES.UNKNOWN]: {
      icon: <HiExclamationCircle className="w-5 h-5 text-slate-500" />,
      bg: "bg-slate-50 border-slate-200",
      title: isAr ? "حدث خطأ غير متوقع" : "Unexpected Error",
      desc: isAr
        ? "حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى."
        : "An unexpected error occurred. Please try again.",
      color: "text-slate-700",
    },
  };
  const cfg = configs[errorType] || configs[ERROR_TYPES.UNKNOWN];
  return (
    <div
      className={`rounded-2xl border px-4 py-3 flex flex-col gap-2 ${cfg.bg}`}
      dir={isAr ? "rtl" : "ltr"}
    >
      <div className="flex items-center gap-2">
        {cfg.icon}
        <p className={`text-[13px] font-bold ${cfg.color}`}>{cfg.title}</p>
      </div>
      <p className={`text-[12px] leading-relaxed ${cfg.color} opacity-90`}>
        {cfg.desc}
      </p>
      {errorType === ERROR_TYPES.MODEL_ALL_FAILED && rawMessage && (
        <details className="mt-1">
          <summary
            className={`text-[11px] cursor-pointer opacity-60 ${cfg.color}`}
          >
            {isAr ? "تفاصيل تقنية" : "Technical details"}
          </summary>
          <pre
            className={`mt-1 text-[10px] whitespace-pre-wrap break-all opacity-60 ${cfg.color}`}
          >
            {rawMessage}
          </pre>
        </details>
      )}
    </div>
  );
}
