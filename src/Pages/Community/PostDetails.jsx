import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  FiMessageCircle,
  FiArrowLeft,
  FiSend,
  FiMoreHorizontal,
} from "react-icons/fi";
import {
  FaRegBookmark,
  FaBookmark,
  FaAngleDoubleUp,
  FaAngleUp,
} from "react-icons/fa";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import AvatarIcon from "../../Components/Common/AvatarIcon1";
import { usePostAnswer } from "../../hooks/usePostAnswer";
import { useGetQuestionsAnswersInfinite } from "../../hooks/useGetQuestionsAnswersInfinite";
import ActionBtn from "../../Components/Common/ActionBtn";
import { useInterestPost } from "../../hooks/useInterestPost";
import { useAuth } from "../../Context/AuthContext";
import { useGetQuestionById } from "../../hooks/useGetQuestionById";
import { useSavePost } from "../../hooks/useSavePost";
import Tag from "./../../Components/Community/Tag";
import PostMenu from "../../Components/Community/PostMenu";
import Spinner from "../../Components/Community/Spinner";
import CommentItem from "../../Components/Community/CommentItem";
import EditModal from "../../Components/Community/EditModal";
import { useEditQuestion } from "../../hooks/useEditQuestion";
import { useEditPost } from "../../hooks/useEditPost";

function handleTime(create) {
  const diff = Date.now() - new Date(create).getTime();
  const m = diff / 60000;
  const h = m / 60;
  const d = h / 24;
  const w = d / 7;
  const mo = d / 30;
  const y = mo / 12;
  if (y >= 1) return `${Math.floor(y)}y ago`;
  if (mo >= 1) return `${Math.floor(mo)}mo ago`;
  if (w >= 1) return `${Math.floor(w)}w ago`;
  if (d >= 1) return `${Math.floor(d)}d ago`;
  if (h >= 1) return `${Math.floor(h)}h ago`;
  if (m >= 1) return `${Math.floor(m)}m ago`;
  return "now";
}

export default function PostDetailPage() {
  const param = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const type = location.state?.type ?? "Question";

  const { data: post } = useGetQuestionById(param.id);
  const { role, accessToken } = useAuth();

  const userEmail = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1])).email
    : null;

  const isOwner = post?.email === userEmail;

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [postMenuOpen, setPostMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [displayContent, setDisplayContent] = useState("");

  useEffect(() => {
    if (!post) return;
    setLiked(post.isInterestedByCurrentUser);
    setSaved(post.isSavedByCurrentUser);
    setLikes(post.interestsCount);
    setDisplayContent(post.content ?? "");
  }, [post]);

  const loadMoreRef = useRef(null);
  const answerMutation = usePostAnswer();
  const editQuestionMutation = useEditQuestion();
  const editPostMutation = useEditPost();
  const editMutation =
    type === "Question" ? editQuestionMutation : editPostMutation;

  const {
    data: commentsData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading: commentsLoading,
  } = useGetQuestionsAnswersInfinite(post?.id);

  const allComments = commentsData
    ? [
        ...new Map(
          commentsData.pages.flatMap((p) => p.items).map((c) => [c.id, c]),
        ).values(),
      ]
    : [];

  const totalComments = commentsData?.pages[0]?.totalCount ?? 0;

  const handleObserver = useCallback(
    (entries) => {
      const [entry] = entries;
      if (entry.isIntersecting && hasNextPage && !isFetchingNextPage)
        fetchNextPage();
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

  const handleAddComment = () => {
    const text = newComment.trim();
    if (!text) return;
    answerMutation.mutate(
      { id: post.id, Data: { content: text, parentAnswerId: null } },
      { onSuccess: () => setNewComment("") },
    );
  };

  const interestMutation = useInterestPost();
  const saveMutation = useSavePost("Question");

  const handleInterest = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    interestMutation.mutate(post?.id);
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
    saveMutation.mutate(post.id);
  };

  const handleEditSave = (newContent) => {
    editMutation.mutate(
      { id: post.id, content: newContent },
      {
        onSuccess: () => {
          setDisplayContent(newContent);
          setEditOpen(false);
        },
      },
    );
  };

  const timeAgo = post?.createdAt ? handleTime(post.createdAt) : "";
  const authorName = post?.patient?.fullName ?? post?.doctor?.fullName;

  return (
    <>
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

            <div className="ml-auto flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] text-slate-400 font-medium">
                Live
              </span>
            </div>
          </motion.div>

          <div className="space-y-4">
            {/* Post Card */}
            <motion.article
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
              <div className="p-6">
                {/* Author row */}
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-3">
                    <AvatarIcon />
                    <div>
                      <p className="text-[14.5px] font-bold text-slate-800 leading-tight">
                        {authorName}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{timeAgo}</p>
                    </div>
                  </div>

                  <div className="relative">
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={() => setPostMenuOpen((v) => !v)}
                      className="p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer border-none bg-transparent"
                    >
                      <FiMoreHorizontal size={18} />
                    </motion.button>
                    <AnimatePresence>
                      {postMenuOpen && (
                        <PostMenu
                          isOwner={isOwner}
                          onEdit={() => {
                            setPostMenuOpen(false);
                            setEditOpen(true);
                          }}
                          onDelete={() => console.log("delete post", post?.id)}
                          onReport={() => console.log("report post", post?.id)}
                          onClose={() => setPostMenuOpen(false)}
                        />
                      )}
                    </AnimatePresence>
                  </div>
                </div>

                <p className="text-[15px] text-slate-600 leading-[1.8] mb-5">
                  {displayContent}
                </p>

                {post?.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-5">
                    {post.tags.map((t) => (
                      <Tag key={t.id} id={t.id} label={t.name} type={type} />
                    ))}
                  </div>
                )}

                <div className="h-px bg-slate-100 mb-4" />

                <div className="flex items-center justify-between">
                  <div className="flex gap-2">
                    {role === "Patient" && (
                      <ActionBtn
                        iconActive={FaAngleDoubleUp}
                        iconInactive={FaAngleUp}
                        label="Interest"
                        labelInActive="Interested"
                        active={liked}
                        activeClass="text-blue-600"
                        onClick={handleInterest}
                        count={likes}
                      />
                    )}
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-[13px] font-semibold text-blue-600 bg-blue-50 select-none">
                      <FiMessageCircle size={15} />
                      {totalComments > 0 && <span>{totalComments}</span>}
                      <span className="hidden sm:inline">Comments</span>
                    </div>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.08 }}
                    whileTap={{ scale: 0.88 }}
                    onClick={handleSave}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all
                      ${
                        saved
                          ? "text-blue-600 bg-blue-50 border-blue-200 shadow-sm"
                          : "text-slate-400 bg-slate-50 border-slate-200 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200"
                      }`}
                  >
                    {saved ? (
                      <FaBookmark size={16} />
                    ) : (
                      <FaRegBookmark size={16} />
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.article>

            {/* Comments Section */}
            <motion.section
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: 0.08,
                ease: [0.22, 1, 0.36, 1],
              }}
              className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
            >
              <div className="px-6 pt-5 pb-4 border-b border-slate-50 flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
                  <FiMessageCircle size={15} className="text-blue-500" />
                </div>
                <div>
                  <h2 className="text-[14px] font-bold text-slate-700">
                    Discussion
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    {totalComments} contributions
                  </p>
                </div>
                <span className="ml-auto text-[11px] font-bold text-blue-600 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full">
                  {totalComments}
                </span>
              </div>

              <div className="p-6 space-y-5">
                {(role === "Doctor" || post?.email === userEmail) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="flex gap-3 items-end"
                  >
                    <AvatarIcon />
                    <div className="flex-1 relative">
                      <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" && !e.shiftKey) {
                            e.preventDefault();
                            handleAddComment();
                          }
                        }}
                        rows={2}
                        placeholder="Write a comment"
                        className="w-full resize-none bg-blue-50/60 border border-blue-100 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-2xl px-4 py-3 pr-14 text-[14px] text-slate-700 placeholder-slate-300 outline-none leading-relaxed transition-all"
                      />
                      <motion.button
                        whileTap={{ scale: 0.88 }}
                        onClick={handleAddComment}
                        disabled={
                          !newComment.trim() || answerMutation.isPending
                        }
                        className={`absolute right-3 bottom-3 w-9 h-9 rounded-xl flex items-center justify-center border-none transition-all
                          ${
                            newComment.trim() && !answerMutation.isPending
                              ? "bg-blue-500 text-white cursor-pointer shadow-md shadow-blue-200 hover:bg-blue-600"
                              : "bg-slate-100 text-slate-300 cursor-not-allowed"
                          }`}
                      >
                        {answerMutation.isPending ? (
                          <Spinner size={14} />
                        ) : (
                          <FiSend size={14} />
                        )}
                      </motion.button>
                    </div>
                  </motion.div>
                )}

                <div className="h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent" />

                {commentsLoading ? (
                  <div className="flex justify-center py-10">
                    <Spinner size={24} />
                  </div>
                ) : allComments.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-10"
                  >
                    <FiMessageCircle
                      size={32}
                      className="text-slate-200 mx-auto mb-3"
                    />
                    <p className="text-[13px] text-slate-400 font-medium">
                      No comments yet. Be the first!
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <AnimatePresence mode="popLayout">
                      {allComments.map((c) => (
                        <CommentItem
                          key={c.id}
                          comment={c}
                          idx={c.id}
                          type={type}
                        />
                      ))}
                    </AnimatePresence>

                    <div ref={loadMoreRef} className="h-2 w-full" />

                    {isFetchingNextPage && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="flex justify-center py-4"
                      >
                        <Spinner size={20} />
                      </motion.div>
                    )}

                    {!hasNextPage && allComments.length > 0 && (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center text-[11px] text-slate-300 font-medium py-2"
                      >
                        — All comments loaded —
                      </motion.p>
                    )}
                  </>
                )}
              </div>
            </motion.section>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      <EditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialText={displayContent}
        onSave={handleEditSave}
        isPending={editMutation.isPending}
        title={type === "Question" ? "Edit Question" : "Edit Article"}
      />
    </>
  );
}
