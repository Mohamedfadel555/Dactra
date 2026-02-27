import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiMessageCircle,
  FiShare2,
  FiBookmark,
  FiSearch,
  FiBell,
  FiX,
  FiSend,
  FiImage,
  FiLink,
  FiSmile,
  FiMoreHorizontal,
  FiHome,
  FiCompass,
  FiBook,
  FiUser,
  FiTrendingUp,
  FiUsers,
} from "react-icons/fi";
import { ImHeart, ImBookmark } from "react-icons/im";
import AvatarIcon from "./../../Components/Common/AvatarIcon1";
import PostCard from "../../Components/Community/PostCard";

// ─── Mock Data ───────────────────────────────────────────────────────────────
const POSTS = [
  {
    id: 1,
    avatar: "AH",
    avatarColor: "from-blue-500 to-blue-700",
    author: "Dr. Ahmed Hassan",
    specialty: "Cardiologist",
    time: "2h ago",
    content:
      "New research confirms that Mediterranean diet significantly reduces cardiovascular risk by up to 30%. Incorporating olive oil, fish, and vegetables into daily meals can make a tremendous difference for patients with hypertension.",
    tags: ["Cardiology", "Nutrition"],
    likes: 142,
    comments: 38,
    shares: 21,
    liked: false,
    saved: false,
  },
  {
    id: 2,
    avatar: "SM",
    avatarColor: "from-cyan-500 to-cyan-700",
    author: "Dr. Sara Mostafa",
    specialty: "Neurologist",
    time: "5h ago",
    content:
      "Exciting breakthrough in Alzheimer's treatment: A new monoclonal antibody therapy shows 35% reduction in cognitive decline during phase 3 trials. This could reshape how we approach early-onset dementia cases.",
    tags: ["Neurology", "Research"],
    likes: 289,
    comments: 74,
    shares: 56,
    liked: true,
    saved: false,
  },
  {
    id: 3,
    avatar: "KN",
    avatarColor: "from-violet-500 to-violet-700",
    author: "Dr. Khalid Nour",
    specialty: "Orthopedic Surgeon",
    time: "8h ago",
    content:
      "Minimally invasive robotic-assisted knee replacement surgery is now showing 90% patient satisfaction at 2-year follow-up. Recovery time cut in half compared to traditional methods.",
    tags: ["Orthopedics", "Surgery"],
    likes: 98,
    comments: 22,
    shares: 14,
    liked: false,
    saved: true,
  },
  {
    id: 4,
    avatar: "NK",
    avatarColor: "from-rose-500 to-rose-700",
    author: "Dr. Nadia Kamel",
    specialty: "Dermatologist",
    time: "1d ago",
    content:
      "Reminder: Sunscreen should be reapplied every 2 hours outdoors, especially during summer. SPF 50+ broad-spectrum protection is recommended for all skin types. Prevention is always better than treatment.",
    tags: ["Dermatology", "Prevention"],
    likes: 210,
    comments: 51,
    shares: 33,
    liked: false,
    saved: false,
  },
];

const TRENDING = [
  { tag: "#Cardiology", count: 124 },
  { tag: "#ClinicalTrials", count: 97 },
  { tag: "#AIinMedicine", count: 213 },
  { tag: "#Oncology", count: 88 },
];

const SUGGESTED = [
  {
    name: "Dr. Layla Adel",
    specialty: "Pediatrician",
    avatar: "LA",
    color: "from-emerald-400 to-emerald-600",
  },
  {
    name: "Dr. Omar Fathi",
    specialty: "Radiologist",
    avatar: "OF",
    color: "from-amber-400 to-amber-600",
  },
];

// ─── Framer variants ─────────────────────────────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const scaleIn = {
  hidden: { scale: 0.92, opacity: 0 },
  show: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.35, ease: [0.34, 1.56, 0.64, 1] },
  },
};

// ─── Action Button ────────────────────────────────────────────────────────────
function ActionBtn({
  iconActive,
  iconInactive,
  label,
  active,
  activeClass = "text-red-500",
  count,
  onClick,
}) {
  const Icon = active ? iconActive : iconInactive;
  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.93 }}
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-sm font-semibold transition-colors
        ${active ? activeClass : "text-slate-500 hover:text-blue-600"}
        hover:bg-blue-50 cursor-pointer select-none`}
    >
      <Icon size={16} />
      {count !== undefined && <span>{count}</span>}
      {label && <span className="hidden sm:inline">{label}</span>}
    </motion.button>
  );
}

// ─── Post Card ────────────────────────────────────────────────────────────────

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar() {
  return (
    <motion.aside
      variants={stagger}
      initial="hidden"
      animate="show"
      className="flex flex-col gap-4"
    >
      {/* Trending */}
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
          {TRENDING.map((t, i) => (
            <motion.div
              key={t.tag}
              whileHover={{ x: 4 }}
              className={`py-2 cursor-pointer ${i < TRENDING.length - 1 ? "border-b border-blue-50" : ""}`}
            >
              <p className="text-sm font-semibold text-blue-600">{t.tag}</p>
              <p className="text-xs text-slate-400">{t.count} posts</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.aside>
  );
}

// ─── Bottom Nav (mobile) ──────────────────────────────────────────────────────
function BottomNav() {
  const [active, setActive] = useState(0);
  const items = [
    { Icon: FiHome, label: "Home" },
    { Icon: FiCompass, label: "Explore" },
    { Icon: FiBook, label: "Articles" },
    { Icon: FiUser, label: "Profile" },
  ];
  return (
    <motion.nav
      initial={{ y: 80 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed bottom-0 inset-x-0 z-50 bg-white/95 backdrop-blur-xl border-t border-blue-100 flex justify-around py-2 pb-safe"
    >
      {items.map(({ Icon, label }, i) => (
        <button
          key={i}
          onClick={() => setActive(i)}
          className="relative flex flex-col items-center gap-0.5 px-4 py-1"
        >
          {active === i && (
            <motion.span
              layoutId="bottomNavIndicator"
              className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500"
            />
          )}
          <Icon
            size={20}
            className={active === i ? "text-blue-600" : "text-slate-400"}
          />
          <span
            className={`text-[10px] font-semibold ${active === i ? "text-blue-600" : "text-slate-400"}`}
          >
            {label}
          </span>
        </button>
      ))}
    </motion.nav>
  );
}

export default function CommunityContainer() {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  const containerRef = useRef(null);

  const handleBlur = (e) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget)
    ) {
      setFocused(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 font-sans pt-[60px]">
      <main className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-6 py-5 pb-24 sm:pb-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 lg:gap-6 items-start">
        {/* Feed */}
        <motion.div
          variants={stagger}
          initial="hidden"
          animate="show"
          className="flex flex-col gap-4"
        >
          <motion.div
            ref={containerRef}
            variants={fadeUp}
            onBlur={handleBlur}
            animate={{
              borderColor: focused
                ? "rgba(59,130,246,0.5)"
                : "rgba(219,234,254,1)",
              boxShadow: focused
                ? "0 0 0 3px rgba(59,130,246,0.12)"
                : "0 1px 3px rgba(0,0,0,0.06)",
            }}
            className="bg-white rounded-2xl p-4 border"
          >
            <div className="flex gap-3 items-start">
              <AvatarIcon />

              <div className="flex-1 min-w-0">
                <motion.textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  onFocus={() => setFocused(true)}
                  placeholder="Share a medical insight, case, or update…"
                  animate={{ height: focused ? 72 : 32 }}
                  transition={{ duration: 0.25, ease: "easeInOut" }}
                  className={`w-full ${focused ? "p-0" : "pt-[7px]"} text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none resize-none leading-relaxed overflow-hidden`}
                />

                {/* Toolbar */}
                <AnimatePresence initial={false}>
                  {focused && (
                    <motion.div
                      key="toolbar"
                      initial={{ opacity: 0, y: -6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="flex items-center justify-between mt-3 flex-wrap gap-2"
                    >
                      {/* Attach icons */}
                      <div className="flex gap-1">
                        <motion.button
                          key={FiLink}
                          whileHover={{ scale: 1.12 }}
                          whileTap={{ scale: 0.92 }}
                          tabIndex={0}
                          className="p-2 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-50 transition-colors focus:outline-none"
                        >
                          <FiLink size={15} />
                        </motion.button>
                      </div>

                      <motion.button
                        whileHover={text.trim() ? { scale: 1.04 } : {}}
                        whileTap={text.trim() ? { scale: 0.96 } : {}}
                        tabIndex={0}
                        disabled={!text.trim()}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all focus:outline-none
                    ${
                      text.trim()
                        ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200 cursor-pointer"
                        : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                    }`}
                      >
                        <FiSend size={13} />
                        Post
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
          {POSTS.map((p) => (
            <PostCard key={p.id} post={p} />
          ))}
        </motion.div>

        <div className="hidden lg:block sticky top-20">
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
