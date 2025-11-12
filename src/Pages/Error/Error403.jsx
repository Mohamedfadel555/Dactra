import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import GIF from "../../assets/images/Error403Image.gif";

export default function ERR403() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-[20px] py-[10px] overflow-hidden">
      {/* 403 Title */}
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-[50px] font-black m-0 font-english text-[#003465]"
      >
        403
      </motion.h1>

      {/* GIF / Image ثابت بدون اختفاء */}
      <div
        className="w-full md:w-[70%] h-[350px] lg:h-[450px] bg-position-[center_40%] bg-cover "
        style={{
          backgroundImage: `url(${GIF})`,
        }}
      />

      {/* Texts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.6, ease: "easeOut" }}
        className="flex flex-col justify-center items-center gap-[10px]"
      >
        <p className="text-[40px] font-english font-bold m-0 text-[#003465]">
          Forbidden
        </p>
        <p className="font-english text-[15px] text-[#BCBEC0] text-center">
          Access to this resource on the server is denied!
        </p>
      </motion.div>

      {/* Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        whileHover={{
          scale: 1.05,
          boxShadow: "0px 0px 15px rgba(62,105,254,0.5)",
        }}
        whileTap={{ scale: 0.95 }}
      >
        <Link
          to={"/"}
          className="w-[30%] min-w-[150px] h-[50px] md:h-[40px] text-[14px] md:text-[18px] font-bold font-english rounded-[10px] bg-[#3E69FE] text-white flex justify-center items-center"
        >
          Go To Home Page
        </Link>
      </motion.div>
    </div>
  );
}
