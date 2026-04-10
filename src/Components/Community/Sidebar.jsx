import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiTrendingUp } from "react-icons/fi";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

export default function Sidebar({ topics, type }) {
  const navigate = useNavigate();
  return (
    <motion.aside
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4"
    >
      <motion.div
        variants={fadeUp}
        className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm"
      >
        <div className="flex items-center gap-2 mb-4">
          <FiTrendingUp size={16} className="text-blue-500" />
          <span className="font-bold text-sm text-slate-800">
            Trending Topics
          </span>
        </div>
        <div className="space-y-1">
          {topics?.map((t, i) => (
            <motion.div
              key={t.id}
              whileHover={{ x: 4 }}
              onClick={() =>
                navigate(`/Community/${type}/tag/${t.id}/${t.name}`)
              }
              className={`py-2 cursor-pointer ${
                i < topics.length - 1 ? "border-b border-blue-50" : ""
              }`}
            >
              <p className="text-sm font-semibold text-blue-600">{t.name}</p>
              <p className="text-xs text-slate-400">{t.count} posts</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}
