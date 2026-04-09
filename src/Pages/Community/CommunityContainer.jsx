import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { TbUserQuestion } from "react-icons/tb";
import { FaHospitalUser } from "react-icons/fa6";
import {
  FiHeart,
  FiMessageCircle,
  FiBookmark,
  FiSend,
  FiLink,
  FiTrendingUp,
  FiGrid,
  FiLoader,
} from "react-icons/fi";
import { FaAngleDoubleUp } from "react-icons/fa";
import AvatarIcon from "./../../Components/Common/AvatarIcon1";
import PostCard from "../../Components/Community/PostCard";
import { useGetPosts } from "../../hooks/useGetPosts";
import { useAuth } from "../../Context/AuthContext";
import { usePostArtical } from "../../hooks/usePostArtical";
import { useFilterPosts } from "../../hooks/useFilterPosts";

const TRENDING = [
  { tag: "#Cardiology", count: 124 },
  { tag: "#ClinicalTrials", count: 97 },
  { tag: "#AIinMedicine", count: 213 },
  { tag: "#Oncology", count: 88 },
];

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};

const getTabs = (type, role) => {
  const tabs = [
    { key: "all", label: "All", icon: FiGrid },
    { key: "saved", label: "Saved", icon: FiBookmark },
  ];

  if (role === "Patient" && type === "Question") {
    tabs.push({ key: "liked", label: "Interested", icon: FaAngleDoubleUp });
  } else if (type === "Artical") {
    tabs.push({ key: "liked", label: "Liked", icon: FiHeart });
  }

  if (role === "Doctor" && type === "Question") {
    tabs.push({ key: "commented", label: "Answered", icon: FiMessageCircle });
  }

  if (type === "Question" && role === "Patient") {
    tabs.push({ key: "my", label: "My Questions", icon: TbUserQuestion });
  }

  if (type === "Artical" && role === "Doctor") {
    tabs.push({ key: "my", label: "My Articals", icon: FaHospitalUser });
  }

  return tabs;
};

function FeedTabs({ active, onChange, counts, type, role }) {
  const TABS = getTabs(type, role);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <div className="relative bg-white rounded-2xl border border-blue-50 shadow-sm p-1 flex gap-1 w-full overflow-hidden">
      {TABS.map((tab) => {
        const isActive = active === tab.key;
        return (
          <motion.button
            key={tab.key}
            onClick={() => onChange(tab.key)}
            whileTap={{ scale: 0.96 }}
            animate={{ flex: isMobile ? (isActive ? 3 : 1) : 1 }}
            transition={{ type: "spring", stiffness: 400, damping: 32 }}
            className={`relative flex items-center justify-center gap-1 px-3 sm:px-4 py-2 rounded-xl
              text-xs sm:text-sm font-semibold transition-colors z-10 min-w-0 overflow-hidden
              ${
                isActive
                  ? "text-blue-600"
                  : "text-slate-500 hover:text-blue-500 hover:bg-blue-50"
              }`}
          >
            {isActive && (
              <motion.span
                layoutId={`feedTabPill-${type}`}
                className="absolute inset-0 bg-blue-50 border border-blue-100 rounded-xl"
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
              />
            )}

            <tab.icon size={14} className="relative z-10 flex-shrink-0" />

            <span className="relative z-10 hidden sm:inline whitespace-nowrap">
              {tab.label}
            </span>

            <motion.span
              className="relative z-10 sm:hidden whitespace-nowrap text-xs leading-none"
              animate={
                isActive && isMobile
                  ? { width: "auto", opacity: 1, marginLeft: 2 }
                  : { width: 0, opacity: 0, marginLeft: 0 }
              }
              transition={{ type: "spring", stiffness: 400, damping: 32 }}
              style={{ overflow: "hidden", display: "inline-block" }}
            >
              {tab.label}
            </motion.span>

            {counts[tab.key] > 0 && (
              <motion.span
                transition={{ type: "spring", stiffness: 400, damping: 32 }}
                style={{ overflow: "hidden", display: "inline-block" }}
                className={`relative z-10 text-[10px] font-bold px-1.5 py-0.5 rounded-full leading-none flex-shrink-0
                  ${isActive ? "bg-blue-500 text-white" : "bg-slate-100 text-slate-500"}`}
              >
                {counts[tab.key]}
              </motion.span>
            )}
          </motion.button>
        );
      })}
    </div>
  );
}

function Spinner({ size = 16 }) {
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

function EmptyState({ tab, type }) {
  const messages = {
    liked: {
      title:
        type === "Question"
          ? "No interested questions yet"
          : "No liked posts yet",
      sub:
        type === "Question"
          ? "Show interest in questions to find them here"
          : "Like posts to find them here quickly",
    },
    saved: {
      title: "No saved posts yet",
      sub: "Bookmark posts to read them later",
    },
    commented: {
      title:
        type === "Question"
          ? "No answered questions yet"
          : "No commented posts yet",
      sub:
        type === "Question"
          ? "Answer questions to find them here"
          : "Join the conversation on any post",
    },
    my: {
      title:
        type === "Question"
          ? "No questions posted yet"
          : "No articles posted yet",
      sub:
        type === "Question"
          ? "Ask your first medical question"
          : "Share your first medical insight",
    },
  };
  const m = messages[tab];
  if (!m) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl border border-blue-50 shadow-sm p-10 flex flex-col items-center gap-3 text-center"
    >
      <p className="font-bold text-slate-700">{m.title}</p>
      <p className="text-sm text-slate-400 max-w-xs">{m.sub}</p>
    </motion.div>
  );
}

function Sidebar() {
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

const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-blue-50 shadow-sm p-5 flex flex-col gap-3 animate-pulse">
    <div className="flex items-center gap-3">
      <div className="w-10 h-10 rounded-full bg-slate-200" />
      <div className="flex flex-col gap-1.5 flex-1">
        <div className="h-3 bg-slate-200 rounded w-1/3" />
        <div className="h-2.5 bg-slate-100 rounded w-1/4" />
      </div>
    </div>
    <div className="h-3 bg-slate-200 rounded w-full" />
    <div className="h-3 bg-slate-200 rounded w-5/6" />
    <div className="h-3 bg-slate-100 rounded w-2/3" />
    <div className="flex gap-4 mt-1">
      <div className="h-6 w-12 bg-slate-100 rounded-lg" />
      <div className="h-6 w-12 bg-slate-100 rounded-lg" />
      <div className="h-6 w-12 bg-slate-100 rounded-lg" />
    </div>
  </div>
);

export default function CommunityContainer({ type }) {
  const [focused, setFocused] = useState(false);
  const [text, setText] = useState("");
  const containerRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const { role } = useAuth();
  const loadRef = useRef(null);

  const {
    data: fil,
    hasNextPage: filHasNextPage,
    isFetchingNextPage: filIsFetchingNextPage,
    fetchNextPage: filFetchNextPage,
  } = useFilterPosts(
    activeTab === "all"
      ? null
      : activeTab === "liked"
        ? 0
        : activeTab === "saved"
          ? 1
          : activeTab === "commented"
            ? 2
            : 3,
    type,
  );

  console.log(fil);

  const {
    data: PostsDetails,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useGetPosts(type);

  console.log(PostsDetails);

  const postMutation = usePostArtical(type);

  const posts = useMemo(() => {
    if (!PostsDetails?.pages) return [];
    return PostsDetails.pages.flatMap((page) =>
      type === "Question"
        ? (page.questions?.items ?? [])
        : (page.posts?.items ?? []),
    );
  }, [PostsDetails, type]);

  const [counts, setCounts] = useState({
    all: 0,
    liked: 0,
    saved: 0,
    commented: 0,
    my: 0,
  });

  useEffect(() => {
    const stats = PostsDetails?.pages?.[0]?.stats;
    if (!stats) return;
    setCounts({
      all: 0,
      liked:
        (type === "Question" ? stats.totalInterested : stats.totalLiked) ?? 0,
      saved: stats.totalSaved ?? 0,
      commented:
        (type === "Question" ? stats.totalAnswered : stats.totalCommented) ?? 0,
      my: stats.totalShared ?? 0,
    });
  }, [PostsDetails?.pages?.[0]?.stats, type]);

  const handlePostUpdate = (att, updateType) => {
    setCounts((prev) => ({
      ...prev,
      [att]: updateType === "inc" ? prev[att] + 1 : prev[att] - 1,
    }));
  };

  const filteredPosts = useMemo(() => {
    if (activeTab === "all") return posts;
    if (!fil?.pages) return [];
    return fil.pages.flatMap((page) =>
      type === "Question"
        ? (page.questions?.items ?? page.items ?? [])
        : (page.posts?.items ?? page.items ?? []),
    );
  }, [activeTab, posts, fil, type]);

  const handleBlur = (e) => {
    if (
      containerRef.current &&
      !containerRef.current.contains(e.relatedTarget)
    ) {
      setFocused(false);
    }
  };
  const handleObserve = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;

      if (activeTab === "all" && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      } else if (
        activeTab !== "all" &&
        filHasNextPage &&
        !filIsFetchingNextPage
      ) {
        filFetchNextPage();
      }
    },
    [
      activeTab,
      fetchNextPage,
      hasNextPage,
      isFetchingNextPage,
      filFetchNextPage,
      filHasNextPage,
      filIsFetchingNextPage,
    ],
  );
  useEffect(() => {
    const el = loadRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(handleObserve, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [handleObserve]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 font-sans pt-[60px]">
      <main className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-6 py-5 pb-24 sm:pb-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 lg:gap-6 items-start">
        <div className="flex flex-col gap-4">
          {/* Compose Box */}
          {((type === "Artical" && role === "Doctor") ||
            (type === "Question" && role === "Patient")) && (
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
                    placeholder={
                      type === "Question"
                        ? "Ask a medical question…"
                        : "Share a medical insight, case, or update…"
                    }
                    animate={{ height: focused ? 72 : 32 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={`w-full ${focused ? "p-0" : "pt-[9px]"} text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none resize-none leading-relaxed overflow-hidden`}
                  />
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
                          disabled={text.length < 10}
                          onClick={() => {
                            postMutation.mutate({ content: text });
                            setText("");
                            setFocused(false);
                          }}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all focus:outline-none
                            ${
                              text.length > 10
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200 cursor-pointer"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                            }`}
                        >
                          <FiSend size={13} />
                          {type === "Question" ? "Ask" : "Post"}
                        </motion.button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </motion.div>
          )}

          <FeedTabs
            active={activeTab}
            onChange={setActiveTab}
            counts={counts}
            type={type}
            role={role}
          />

          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.22, ease: "easeOut" }}
              className="flex flex-col gap-4"
            >
              {/* ✅ isLoading بدل isFetching عشان ما يظهرش في background refetch */}
              {isLoading ? (
                <>
                  <SkeletonCard />
                  <SkeletonCard />
                  <SkeletonCard />
                </>
              ) : filteredPosts?.length === 0 && activeTab !== "all" ? (
                <EmptyState tab={activeTab} type={type} />
              ) : (
                filteredPosts?.map((p, i) => (
                  <motion.div
                    key={p.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.06, duration: 0.32 }}
                  >
                    <PostCard
                      type={type}
                      post={p}
                      onUpdate={handlePostUpdate}
                    />
                  </motion.div>
                ))
              )}

              <div ref={loadRef} className="h-2 w-full">
                {(isFetchingNextPage || filIsFetchingNextPage) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-center py-4"
                  >
                    <Spinner size={20} />
                  </motion.div>
                )}

                {/* all tab */}
                {activeTab === "all" && !hasNextPage && posts.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-[11px] text-slate-300 font-medium py-2"
                  >
                    — All posts loaded —
                  </motion.p>
                )}

                {/* filtered tabs */}
                {activeTab !== "all" &&
                  !filHasNextPage &&
                  filteredPosts.length > 0 && (
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center text-[11px] text-slate-300 font-medium py-2"
                    >
                      — All posts loaded —
                    </motion.p>
                  )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="hidden lg:block sticky top-20">
          <Sidebar />
        </div>
      </main>
    </div>
  );
}
