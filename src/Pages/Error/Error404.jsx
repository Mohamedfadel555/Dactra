import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import GIF from "../../assets/images/Error404Image.gif";

export default function ERR404() {
  return (
    <div className="w-full h-screen flex flex-col justify-center items-center gap-[20px] py-[10px]">
      <motion.h1
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0, rotate: [0, 2, -2, 0] }}
        transition={{ duration: 2 }}
        className="text-[50px] font-black m-0 font-english text-[#003465]"
      >
        404
      </motion.h1>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.8 }}
        className="w-full md:w-[70%] h-[350px] bg-center bg-cover"
        style={{
          backgroundImage: `url(${GIF})`,
        }}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.6 }}
        className="flex flex-col justify-center items-center gap-[10px]"
      >
        <p className="text-[40px] font-english font-bold m-0 text-[#003465]">
          Page not found
        </p>
        <p className="font-english text-[15px] text-[#BCBEC0]">
          the page you are looking for not available!
        </p>
      </motion.div>

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Link
          to={"/"}
          className="lg:w-[20%] md:w-[30%] min-w-[150px] h-[50px] md:h-[50px] text-[14px] md:text-[18px] font-bold font-english rounded-[10px] bg-[#3E69FE] text-white flex justify-center items-center"
        >
          Go To Home Page
        </Link>
      </motion.div>
    </div>
  );
}
