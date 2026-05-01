import { Link } from "react-router-dom";
import { FaStar } from "react-icons/fa";
import { MdLocationOn } from "react-icons/md";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { useState } from "react";

/** Card for Lab or Scan Center on patient-facing list/home (details on /labs/:id). */
export default function ServiceProviderCard({
  id,
  name,
  address,
  avg_Rating,
  type,
  isFavourite = false,
  imageUrl = "",
}) {
  const isLab = type === 0;
  const label = isLab ? "View Lab" : "View Center";
  const rating = avg_Rating ?? "—";
  const [isFav, setIsFav] = useState(isFavourite);

  return (
    <div className="w-full max-w-[400px] mx-auto h-full min-h-[200px] bg-white rounded-2xl shadow-[0_3px_10px_rgba(15,23,42,0.08)] border border-gray-100 overflow-hidden hover:shadow-[0_10px_25px_rgba(15,23,42,0.16)] transition-shadow duration-200 flex flex-col">
      <div className="p-4 sm:p-5 flex flex-col flex-1 h-full min-h-0">
        <div className="flex items-start justify-between gap-2 shrink-0">
          <div className="min-w-0 flex items-start gap-3">
            <img
              src={imageUrl || `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "Provider")}&background=316BE8&color=fff`}
              alt={name || "Provider"}
              className="w-12 h-12 rounded-xl object-cover"
            />
            <div className="min-w-0">
            <h3 className="text-sm sm:text-base font-bold text-gray-900 line-clamp-1">
              {name || "—"}
            </h3>
            <div className="flex items-center gap-1 mt-1 text-amber-600">
              <FaStar className="w-4 h-4 shrink-0" />
              <span className="font-medium text-sm">{rating}</span>
            </div>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setIsFav((prev) => !prev)}
            className="mt-0.5 text-xl text-red-500 hover:scale-110 transition-transform shrink-0"
            aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
          >
            {isFav ? <IoIosHeart /> : <IoIosHeartEmpty className="text-gray-400" />}
          </button>
        </div>

        <div className="shrink-0 mt-2 min-h-[1.25rem]">
          {address ? (
            <div className="flex items-center gap-1.5 text-gray-600 text-[11px] sm:text-xs">
              <MdLocationOn className="w-4 h-4 flex-shrink-0" />
              <span className="line-clamp-1">{address}</span>
            </div>
          ) : (
            <div className="text-[11px] text-gray-400 italic">No address</div>
          )}
        </div>

        <div className="flex-1 min-h-0" aria-hidden />

        <Link
          to={`/labs/${id}`}
          className="mt-auto pt-3 inline-flex items-center justify-center w-full py-2 rounded-lg bg-[#316BE8] text-white text-sm font-medium hover:bg-[#2552c1] transition shrink-0"
        >
          {label}
        </Link>
      </div>
    </div>
  );
}
