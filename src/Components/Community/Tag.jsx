import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Tag({ label, id, type }) {
  const navigate = useNavigate();

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={() => navigate(`/Community/${type}/tag/${id}/${label}`)}
      className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full cursor-pointer hover:bg-blue-100 hover:border-blue-200 transition-colors"
    >
      #{label}
    </motion.button>
  );
}
