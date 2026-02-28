import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiSend,
  FiLink,
  FiHome,
  FiCompass,
  FiBook,
  FiUser,
  FiTrendingUp,
  FiGrid,
} from "react-icons/fi";
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
    commented: true,
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
    commented: false,
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
    commented: false,
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
    commented: true,
  },
];

const TRENDING = [
  { tag: "#Cardiology", count: 124 },
  { tag: "#ClinicalTrials", count: 97 },
  { tag: "#AIinMedicine", count: 213 },
  { tag: "#Oncology", count: 88 },
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

// ─── Feed Tabs ────────────────────────────────────────────────────────────────
const TABS = [
  { key: "all", label: "All", icon: FiGrid, filter: () => true },
  { key: "liked", label: "Liked", icon: FiHeart, filter: (p) => p.liked },
  { key: "saved", label: "Saved", icon: FiBookmark, filter: (p) => p.saved },
  {
    key: "commented",
    label: "Commented",
    icon: FiMessageCircle,
    filter: (p) => p.commented,
  },
];

function FeedTabs({ active, onChange, counts }) {
  return (
    <div className="relative bg-white rounded-2xl border border-blue-50 shadow-sm p-1 flex gap-1 overflow-x-auto scrollbar-none">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <motion.button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            whileTap={{ scale: 0.96 }}
            className={`relative flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold whitespace-nowrap flex-1 justify-center transition-colors z-10
              ${isActive ? "text-blue-600" : "text-slate-500 hover:text-blue-500 hover:bg-blue-50"}`}
          >
            {isActive && (
              <motion.span
                layoutId="feedTabPill"
                className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-xl"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}
            <tab.icon size={14} className="relative z-10 flex-shrink-0" />
            <span className="relative z-10">{tab.label}</span>
            {counts[tab.key] > 0 && (
              <span
                className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none
                  ${isActive ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {counts[tab.key]}
              </span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────
function EmptyState({ tab }) {
  const messages = {
    liked: {
      emoji: "❤️",
      title: "No liked posts yet",
      sub: "Like posts to find them here quickly",
    },
    saved: {
      emoji: "🔖",
      title: "No saved posts yet",
      sub: "Bookmark posts to read them later",
    },
    commented: {
      emoji: "💬",
      title: "No commented posts yet",
      sub: "Join the conversation on any post",
    },
  };
  const m = messages[tab];
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-blue-50 shadow-sm p-10 flex flex-col items-center gap-3 text-center"
    >
      <span className="text-4xl">{m.emoji}</span>
      <p className="font-bold text-slate-700">{m.title}</p>
      <p className="text-sm text-slate-400 max-w-xs">{m.sub}</p>
    </motion.div>
  );
}

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
              className={`py-2 cursor-pointer ${
                i < TRENDING.length - 1 ? "border-b border-blue-50" : ""
              }`}
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
            className={`text-[10px] font-semibold ${
              active === i ? "text-blue-600" : "text-slate-400"
            }`}
          >
            {label}
          </span>
        </button>
      ))}
    </motion.nav>
  );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function CommunityContainer() {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  const containerRef = useRef(null);

  const [activeTab, setActiveTab] = useState("all");
  const [posts, setPosts] = useState(POSTS);

  // counts for badge on each tab
  const counts = {
    all: 0,
    liked: posts.filter((p) => p.liked).length,
    saved: posts.filter((p) => p.saved).length,
    commented: posts.filter((p) => p.commented).length,
  };

  // filtered list based on active tab
  const currentTab = TABS.find((t) => t.key === activeTab);
  const filteredPosts = posts.filter(currentTab.filter);

  // bubble up like/save changes from PostCard so tab counts stay live
  const handlePostUpdate = (id, changes) => {
    setPosts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...changes } : p)),
    );
  };

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
        <div className="flex flex-col gap-4">
          {/* Compose Box */}
          <motion.div
            ref={containerRef}
            variants={fadeUp}
            initial="hidden"
            animate={{
              opacity: 1,
              y: 0,
              borderColor: focused
                ? "rgba(59,130,246,0.5)"
                : "rgba(219,234,254,1)",
              boxShadow: focused
                ? "0 0 0 3px rgba(59,130,246,0.12)"
                : "0 1px 3px rgba(0,0,0,0.06)",
            }}
            onBlur={handleBlur}
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
                      <div className="flex gap-1">
                        <motion.button
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

          {/* ── Feed Tabs ── */}
          <FeedTabs
            active={activeTab}
            onChange={setActiveTab}
            counts={counts}
          />

          {/* ── Posts ── */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {filteredPosts.length === 0 && activeTab !== "all" ? (
                <EmptyState tab={activeTab} />
              ) : (
                filteredPosts.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.32 }}
                  >
                    <PostCard post={p} onUpdate={handlePostUpdate} />
                  </motion.div>
                ))
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Sidebar — desktop only */}
        <div className="hidden lg:block sticky top-20">
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
