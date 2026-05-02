import { useCallback, useEffect, useRef, useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiSend, FiLoader, FiImage, FiX } from "react-icons/fi";
import AvatarIcon from "./../../Components/Common/AvatarIcon1";
import PostCard from "../../Components/Community/PostCard";
import { useGetPosts } from "../../hooks/useGetPosts";
import { useAuth } from "../../Context/AuthContext";
import { usePostArtical } from "../../hooks/usePostArtical";
import { useFilterPosts } from "../../hooks/useFilterPosts";
import { useGetTrendingTags } from "../../hooks/useGetTrendingTags";
import Sidebar from "../../Components/Community/Sidebar";
import FeedTabs from "../../Components/Community/FeedTabs";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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
  const [expanded, setExpanded] = useState(false); // بديل focused — مش بيتأثر بالـ blur
  const [text, setText] = useState("");
  const [image, setImage] = useState(null); // { file, preview }
  const [isPosting, setIsPosting] = useState(false);
  const fileInputRef = useRef(null);
  const [activeTab, setActiveTab] = useState("all");
  const { role } = useAuth();
  const loadRef = useRef(null);

  const { data: trendingTags } = useGetTrendingTags(type);

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

  const {
    data: PostsDetails,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    fetchNextPage,
  } = useGetPosts(type);

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

  // ── Image picker ──────────────────────────────────────────
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (image?.preview) URL.revokeObjectURL(image.preview);
    const preview = URL.createObjectURL(file);
    setImage({ file, preview });
    setExpanded(true);
  };

  const removeImage = () => {
    if (image?.preview) URL.revokeObjectURL(image.preview);
    setImage(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  // ── Submit ────────────────────────────────────────────────
  const handleSubmit = async () => {
    if (isPosting) return;
    setIsPosting(true);
    try {
      await postMutation.mutateAsync({
        content: text,
        image: image?.file ?? null,
      });
      setText("");
      removeImage();
      setExpanded(false);
    } finally {
      setIsPosting(false);
    }
  };

  const canPost = text.length >= 10 && !isPosting;

  // ── Infinite scroll ───────────────────────────────────────
  const handleObserve = useCallback(
    (entries) => {
      const [entry] = entries;
      if (!entry.isIntersecting) return;
      if (activeTab === "all" && hasNextPage && !isFetchingNextPage)
        fetchNextPage();
      else if (activeTab !== "all" && filHasNextPage && !filIsFetchingNextPage)
        filFetchNextPage();
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

  // ── إغلاق الـ compose لو ضغط برا ────────────────────────
  useEffect(() => {
    if (!expanded) return;
    const handleClickOutside = (e) => {
      if (!e.target.closest("[data-compose]")) {
        if (!text && !image) setExpanded(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [expanded, text, image]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-slate-50 font-sans pt-[60px]">
      <main className="max-w-6xl mx-auto px-3 sm:px-5 lg:px-6 py-5 pb-24 sm:pb-8 grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-5 lg:gap-6 items-start">
        <div className="flex flex-col gap-4">
          {/* ── Compose Box ───────────────────────────────── */}
          {((type === "Artical" && role === "Doctor") ||
            (type === "Question" && role === "Patient")) && (
            <motion.div
              data-compose
              variants={fadeUp}
              initial="hidden"
              animate={{
                opacity: 1,
                y: 0,
                borderColor: expanded
                  ? "rgba(59,130,246,0.5)"
                  : "rgba(219,234,254,1)",
                boxShadow: expanded
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
                    onFocus={() => setExpanded(true)}
                    placeholder={
                      type === "Question"
                        ? "Ask a medical question…"
                        : "Share a medical insight, case, or update…"
                    }
                    animate={{ height: expanded ? 72 : 32 }}
                    transition={{ duration: 0.25, ease: "easeInOut" }}
                    className={`w-full ${expanded ? "p-0" : "pt-[9px]"} text-sm text-slate-700 placeholder-slate-400 bg-transparent outline-none resize-none leading-relaxed overflow-hidden`}
                  />

                  {/* ── Image Preview ── دايماً ظاهر لو في صورة */}
                  <AnimatePresence>
                    {image && (
                      <motion.div
                        initial={{ opacity: 0, y: 8, scale: 0.97 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.97 }}
                        transition={{ duration: 0.2 }}
                        className="relative mt-3 inline-block"
                      >
                        <img
                          src={image.preview}
                          alt="preview"
                          className="max-h-52 max-w-full rounded-xl border border-blue-100 object-cover shadow-sm"
                        />
                        {/* overlay gradient */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-t from-black/10 to-transparent pointer-events-none" />
                        <button
                          onClick={removeImage}
                          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full p-1 transition-colors backdrop-blur-sm"
                        >
                          <FiX size={12} />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* ── Toolbar ── */}
                  <AnimatePresence initial={false}>
                    {expanded && (
                      <motion.div
                        key="toolbar"
                        initial={{ opacity: 0, y: -6 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -6 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                        className="flex items-center justify-between mt-3 flex-wrap gap-2"
                      >
                        <div className="flex gap-1 items-center">
                          {/* Image btn */}
                          <motion.button
                            whileHover={{ scale: 1.12 }}
                            whileTap={{ scale: 0.92 }}
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className={`p-2 rounded-lg transition-colors focus:outline-none ${
                              image
                                ? "text-blue-500 bg-blue-50"
                                : "text-slate-400 hover:text-blue-500 hover:bg-blue-50"
                            }`}
                          >
                            <FiImage size={15} />
                          </motion.button>

                          {image && (
                            <span className="text-[11px] text-blue-400 font-medium">
                              1 image
                            </span>
                          )}

                          {/* Hidden file input */}
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleImageChange}
                          />
                        </div>

                        {/* Post btn */}
                        <motion.button
                          whileHover={canPost ? { scale: 1.04 } : {}}
                          whileTap={canPost ? { scale: 0.96 } : {}}
                          type="button"
                          disabled={!canPost}
                          onClick={handleSubmit}
                          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all focus:outline-none min-w-[80px] justify-center
                            ${
                              canPost
                                ? "bg-gradient-to-r from-blue-500 to-cyan-500 text-white shadow-md shadow-blue-200 cursor-pointer"
                                : "bg-slate-100 text-slate-400 cursor-not-allowed opacity-60"
                            }`}
                        >
                          {isPosting ? (
                            <>
                              <motion.div
                                animate={{ rotate: 360 }}
                                transition={{
                                  repeat: Infinity,
                                  duration: 0.7,
                                  ease: "linear",
                                }}
                              >
                                <FiLoader size={13} />
                              </motion.div>
                              Posting…
                            </>
                          ) : (
                            <>
                              <FiSend size={13} />
                              {type === "Question" ? "Ask" : "Post"}
                            </>
                          )}
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
                {activeTab === "all" && !hasNextPage && posts.length > 0 && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center text-[11px] text-slate-300 font-medium py-2"
                  >
                    — All posts loaded —
                  </motion.p>
                )}
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
          <Sidebar topics={trendingTags} type={type} />
        </div>
      </main>
    </div>
  );
}
