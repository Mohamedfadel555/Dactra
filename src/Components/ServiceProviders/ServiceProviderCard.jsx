import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useState } from "react";

/**
 * Card for Lab or Scan Center on patient-facing pages
 * type: 0 = Lab, 1 = Scan
 */
export default function ServiceProviderCard({
  id,
  name,
  address,
  avg_Rating,
  type,
  topServices = [],
  isFavourite = false,
}) {
  const isLab = type === 0;
  const label = isLab ? "View Lab" : "View Center";
  const rating = avg_Rating ?? "—";
  const [isFav, setIsFav] = useState(isFavourite);

  return (
    <div className="w-full max-w-[400px] mx-auto bg-white rounded-2xl shadow-[0_3px_10px_rgba(15,23,42,0.08)] border border-gray-100 overflow-hidden hover:shadow-[0_10px_25px_rgba(15,23,42,0.16)] transition-shadow duration-200">
      <div className="p-4 sm:p-5">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1">
              {name || "—"}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-amber-600">
              <FaStar className="w-4 h-4" />
              <span className="font-medium text-sm">{rating}</span>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsFav((prev) => !prev)}
            className="mt-0.5 text-xl text-red-500 hover:scale-110 transition-transform"
          >
            {isFav ? <IoIosHeart /> : <IoIosHeartEmpty className="text-gray-400" />}
          </button>
        </div>
        {address && (
          <div className="flex items-center gap-1.5 mt-2 text-gray-600 text-[11px] sm:text-xs">
            <MdLocationOn className="w-4 h-4 flex-shrink-0" />
            <span className="line-clamp-1">{address}</span>
          </div>
        )}
        {topServices.length > 0 && (
          <p className="text-xs text-gray-500 mt-2">
            <span className="font-medium text-gray-700">Top: </span>
            {topServices.slice(0, 3).join(", ")}
          </p>
        )}
        <Link
          to={`/labs/${id}`}
          className="mt-3 inline-flex items-center justify-center w-full py-2 rounded-lg bg-[#316BE8] text-white text-sm font-medium hover:bg-[#2552c1] transition"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
