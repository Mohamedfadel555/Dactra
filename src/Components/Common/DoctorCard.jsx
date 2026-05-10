import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FaStar, FaUserMd } from "react-icons/fa";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useFavourite } from "./../../hooks/useFavourite";

export default function DoctorCard({
  doctorId = null,
  name,
  specialist,
  rating,
  ratingNo,
  isFavourite = false,
  imageUrl = "",
}) {
  const navigate = useNavigate();
  const [isFav, setIsFav] = useState(isFavourite);
  const [imgError, setImgError] = useState(false);
  const { mutate: toggleFav, isPending } = useFavourite(1);

  useEffect(() => {
    setIsFav(isFavourite);
  }, [isFavourite]);

  const toggleFavourite = (e) => {
    e.stopPropagation();

    if (!doctorId || isPending) return;

    const prevFav = isFav;
    setIsFav(!isFav);
    toggleFav(doctorId, {
      onError: () => setIsFav(prevFav),
    });
  };

  const displayName = (name || "").trim() || "Unknown";

  return (
    <div
      onClick={() => navigate(`/doctor/profile/${doctorId}`)}
      className="w-[300px] bg-white p-[18px] rounded-[20px] flex flex-col gap-1 shadow-[0_3px_6px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.10)] cursor-pointer"
    >
      <div className="w-full rounded-[20px] aspect-[4/3] bg-gray-100 flex items-center justify-center overflow-hidden">
        {!imageUrl || imgError ? (
          <FaUserMd className="text-[80px] text-gray-400" />
        ) : (
          <img
            loading="lazy"
            alt="Doctor"
            src={imageUrl}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      <h3 className="text-[#3D3D3D] text-[25px] font-bold">
        {"Dr. " + displayName}
      </h3>

      <p className="text-[#64748B] font-semibold text-[22px]">
        {specialist + " Specialist"}
      </p>

      <div className="flex justify-between items-center mt-2">
        <div className="flex justify-center items-center gap-[5px]">
          <FaStar className="text-[#EAB308] text-[20px]" />
          <p className="text-[#64748B] text-[18px]">
            {rating + "(" + ratingNo + ")"}
          </p>
        </div>

        <button
          type="button"
          onClick={toggleFavourite}
          disabled={isPending}
          className="cursor-pointer border-none bg-transparent p-0 disabled:opacity-50"
          aria-label={isFav ? "Remove from favourites" : "Add to favourites"}
        >
          <AnimatePresence mode="wait">
            {isFav ? (
              <motion.div
                key="filled"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
                whileTap={{ scale: 1.2 }}
              >
                <IoIosHeart className="text-[25px] text-red-500" />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 500, damping: 10 }}
                whileTap={{ scale: 1.2 }}
              >
                <IoIosHeartEmpty className="text-[25px] text-[#64748B]" />
              </motion.div>
            )}
          </AnimatePresence>
        </button>
      </div>
    </div>
  );
}
