import Doctor from "../../assets/images/Frame 93.webp";
import { IoIosHeart, IoIosHeartEmpty } from "react-icons/io";
import { FaStar } from "react-icons/fa";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function DoctorCard({
  name,
  specialist,
  rating,
  ratingNo,
  isFavourite = false,
}) {
  const [isFav, setIsFav] = useState(isFavourite);

  return (
    <div className="w-[300px] bg-white p-[18px] rounded-[20px] flex flex-col gap-1 shadow-[0_3px_6px_rgba(0,0,0,0.06),0_12px_28px_rgba(0,0,0,0.10)]">
      <img
        loading="lazy"
        alt="Doctor photo"
        src={Doctor}
        className="w-full rounded-[20px]"
      />
      <h3 className="text-[#3D3D3D] text-[25px] font-bold">{"Dr." + name}</h3>
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

        <div
          onClick={() => setIsFav((prev) => !prev)}
          className="cursor-pointer"
        >
          <AnimatePresence mode="wait">
            {isFav ? (
              <motion.div
                key="filled"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 10,
                }}
                whileTap={{ scale: 1.2 }}
              >
                <IoIosHeart className="text-[25px] text-red-500" />
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 500,
                  damping: 10,
                }}
                whileTap={{ scale: 1.2 }}
              >
                <IoIosHeartEmpty className="text-[25px] text-[#64748B]" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
