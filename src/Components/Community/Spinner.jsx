import { FiLoader } from "react-icons/fi";
import { motion } from "framer-motion";

export default function Spinner({ size = 16 }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      className="inline-flex"
    >
      <FiLoader size={size} className="text-blue-400" />
    </motion.div>
  );
}
