import { useCallback, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiLoader, FiHash } from "react-icons/fi";
import PostCard from "../../Components/Community/PostCard";
import { useGetPostsByTag } from "../../hooks/useGetPostsByTag";

function Spinner({ size = 20 }) {
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
    </div>
  </div>
);

export default function TagPostsPage({ type = "Question" }) {
  const { tagId, tagName } = useParams();
  const navigate = useNavigate();
  const loadMoreRef = useRef(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useGetPostsByTag(tagId, type);

  const allPosts = data
    ? [
        ...new Map(
          data.pages
            .flatMap((page) =>
              type === "Question"
                ? (page.questions?.items ?? page.items ?? [])
                : (page.posts?.items ?? page.items ?? []),
            )
            .map((p) => [p.id, p]),
        ).values(),
      ]
    : [];

  const totalCount = data?.pages?.[0]?.totalCount;

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
        fetchNextPage();
      }
    },
    [fetchNextPage, hasNextPage, isFetchingNextPage],
  );

  useEffect(() => {
    const el = loadMoreRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(handleObserver, { threshold: 0.1 });
    obs.observe(el);
    return () => obs.disconnect();
  }, [handleObserver]);

  return (
    <div className="pt-[60px] min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-white">
      <div className="max-w-2xl mx-auto px-4 pb-16">
        {/* Top bar */}
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="flex items-center gap-3 py-4"
        >
          <motion.button
            whileHover={{ scale: 1.03, x: -2 }}
            whileTap={{ scale: 0.94 }}
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-600 text-[13px] font-semibold cursor-pointer hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm"
          >
            <FiArrowLeft size={14} />
            Back
          </motion.button>
        </motion.div>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden mb-5"
        >
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
          <div className="px-6 py-5 flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
              <FiHash size={20} className="text-blue-500" />
            </div>
            <div>
              <h1 className="text-[18px] font-bold text-slate-800 leading-tight">
                #{tagName ?? tagId}
              </h1>
              {totalCount > 0 && (
                <p className="text-[12px] text-slate-400 mt-0.5">
                  {totalCount} {type === "Question" ? "question" : "post"}
                  {totalCount !== 1 ? "s" : ""}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* Posts list */}
        <div className="flex flex-col gap-4">
          {isLoading ? (
            <>
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </>
          ) : isError ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center"
            >
              <p className="text-[14px] font-semibold text-slate-500">
                Something went wrong. Please try again.
              </p>
            </motion.div>
          ) : allPosts.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm p-10 text-center"
            >
              <FiHash size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-[13px] text-slate-400 font-medium">
                No {type === "Question" ? "questions" : "posts"} for this tag
                yet.
              </p>
            </motion.div>
          ) : (
            <AnimatePresence mode="popLayout">
              {allPosts.map((post, i) => (
                <motion.div
                  key={post.id}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.05, duration: 0.32 }}
                >
                  <PostCard type={type} post={post} onUpdate={() => {}} />
                </motion.div>
              ))}
            </AnimatePresence>
          )}

          {/* Infinite scroll sentinel */}
          <div ref={loadMoreRef} className="h-2 w-full">
            {isFetchingNextPage && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex justify-center py-4"
              >
                <Spinner size={20} />
              </motion.div>
            )}

            {!hasNextPage && allPosts.length > 0 && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-[11px] text-slate-300 font-medium py-2"
              >
                — All posts loaded —
              </motion.p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
