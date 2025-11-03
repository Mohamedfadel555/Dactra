import Icon from "../../assets/images/icons/dactraIcon.png";
import { motion } from "framer-motion";

export default function BrandLogo({
  size = "size-[50px]",
  textSize = "text-[30px]",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      whileHover={{ scale: 1.03 }}
      className="flex justify-center items-center gap-[10px] cursor-pointer select-none"
    >
      {/* Logo Icon */}
      <motion.img
        src={Icon}
        alt="Dactra Icon"
        className={`${size}`}
        whileHover={{ rotate: 8 }}
        transition={{ type: "spring", stiffness: 200, damping: 10 }}
      />

      {/* Brand Name */}
      <motion.p
        className={`font-english font-[800] ${textSize} text-[#003465]`}
        whileHover={{ x: 3 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      >
        Dactra
      </motion.p>
    </motion.div>
  );
}
