import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MdStar, MdLocationOn, MdScience, MdBiotech } from "react-icons/md";

// Stagger animation hook
function useReveal(delay = 0) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.1 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible, delay };
}

export default function ServiceProviderCard({
  id,
  name,
  address,
  avg_Rating,
  type,
  imageUrl,
}) {
  const isLab = type === 0;
  const { ref, visible, delay } = useReveal();
  const initial = name ? name.charAt(0).toUpperCase() : "?";

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(32px)",
        transition: `opacity 0.55s ease ${delay}ms, transform 0.55s cubic-bezier(.22,.68,0,1.2) ${delay}ms`,
      }}
      className="h-full"
    >
      <Link to={`/service-providers/${id}`} className="block h-full group">
        <div
          className="relative h-full rounded-2xl overflow-hidden bg-white border border-slate-100
          shadow-[0_2px_16px_0_rgba(49,107,232,0.07)]
          group-hover:shadow-[0_8px_32px_0_rgba(49,107,232,0.18)]
          group-hover:-translate-y-1.5
          transition-all duration-300 ease-out flex flex-col"
        >
          {/* Top accent bar */}
          <div
            className={`h-1 w-full ${isLab ? "bg-gradient-to-r from-[#316BE8] to-[#6A9FFF]" : "bg-gradient-to-r from-[#0EA5E9] to-[#38BDF8]"}`}
          />

          {/* Card body */}
          <div className="p-5 flex flex-col gap-4 flex-1">
            {/* Header row */}
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div
                className={`relative w-14 h-14 rounded-xl flex-shrink-0 overflow-hidden
                ${isLab ? "bg-gradient-to-br from-[#EEF3FF] to-[#C7D9FF]" : "bg-gradient-to-br from-[#E0F5FF] to-[#BAE6FD]"}`}
              >
                {imageUrl ? (
                  <img
                    src={imageUrl}
                    alt={name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span
                    className={`absolute inset-0 flex items-center justify-center text-xl font-bold
                    ${isLab ? "text-[#316BE8]" : "text-[#0EA5E9]"}`}
                  >
                    {initial}
                  </span>
                )}
              </div>

              {/* Name + badge */}
              <div className="flex-1 min-w-0">
                <h3 className="text-gray-900 font-semibold text-base leading-snug truncate group-hover:text-[#316BE8] transition-colors duration-200">
                  {name || "—"}
                </h3>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <span
                    className={`inline-flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full
                    ${
                      isLab
                        ? "bg-[#EEF3FF] text-[#316BE8]"
                        : "bg-[#E0F5FF] text-[#0EA5E9]"
                    }`}
                  >
                    {isLab ? (
                      <MdScience className="w-3 h-3" />
                    ) : (
                      <MdBiotech className="w-3 h-3" />
                    )}
                    {isLab ? "Lab" : "Scan Center"}
                  </span>
                </div>
              </div>
            </div>

            {/* Address */}
            {address && (
              <div className="flex items-start gap-1.5 text-sm text-gray-500">
                <MdLocationOn className="w-4 h-4 text-gray-400 mt-0.5 flex-shrink-0" />
                <span className="line-clamp-2 leading-relaxed">{address}</span>
              </div>
            )}

            {/* Footer: rating + arrow */}
            <div className="mt-auto flex items-center justify-between pt-3 border-t border-slate-100">
              {avg_Rating > 0 ? (
                <div className="flex items-center gap-1">
                  <MdStar className="w-4 h-4 text-amber-400" />
                  <span className="text-sm font-semibold text-gray-800">
                    {avg_Rating}
                  </span>
                  <span className="text-xs text-gray-400">/ 5</span>
                </div>
              ) : (
                <span className="text-xs text-gray-400">No ratings yet</span>
              )}
              <span
                className={`text-xs font-semibold flex items-center gap-1
                ${isLab ? "text-[#316BE8]" : "text-[#0EA5E9]"}
                group-hover:gap-2 transition-all duration-200`}
              >
                View details
                <svg
                  className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 16 16"
                >
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
