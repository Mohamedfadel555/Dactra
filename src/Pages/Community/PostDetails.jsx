import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useCallback, useEffect } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiArrowLeft,
  FiSend,
  FiMoreHorizontal,
  FiCornerDownRight,
  FiChevronDown,
  FiChevronUp,
  FiLoader,
  FiEdit2,
  FiTrash2,
  FiFlag,
} from "react-icons/fi";
import {
  FaRegBookmark,
  FaBookmark,
  FaAngleDoubleUp,
  FaAngleUp,
} from "react-icons/fa";
import { ImHeart } from "react-icons/im";
import { useNavigate, useParams } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import AvatarIcon from "../../Components/Common/AvatarIcon1";
import { usePostAnswer } from "../../hooks/usePostAnswer";
import { useGetCommentReplies } from "../../hooks/useGetCommentReplies";
import { useLikeComment } from "../../hooks/useLikeComment";
import { useGetQuestionsAnswersInfinite } from "../../hooks/useGetQuestionsAnswersInfinite";
import ActionBtn from "../../Components/Common/ActionBtn";
import { useInterestPost } from "../../hooks/useInterestPost";
import { useAuth } from "../../Context/AuthContext";
import { useGetQuestionById } from "../../hooks/useGetQuestionById";
import { useSavePost } from "../../hooks/useSavePost";

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

function Tag({ label }) {
  return (
    <motion.span
      whileHover={{ scale: 1.05 }}
      className="text-[11px] font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full cursor-default"
    >
      #{label}
    </motion.span>
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

function DoctorBadge() {
  return (
    <span className="inline-flex items-center text-[9px] font-bold text-white bg-blue-500 px-1.5 py-0.5 rounded-md leading-none tracking-wide">
      DR
    </span>
  );
}

// ── Shared dropdown menu ──
function ContextMenu({ isOwner, onEdit, onDelete, onReport, onClose }) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) onClose();
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const items = isOwner
    ? [
        {
          icon: FiEdit2,
          label: "Edit post",
          onClick: onEdit,
          color: "text-slate-600",
        },
        {
          icon: FiTrash2,
          label: "Delete post",
          onClick: onDelete,
          color: "text-rose-500",
        },
      ]
    : [
        {
          icon: FiFlag,
          label: "Report post",
          onClick: onReport,
          color: "text-amber-500",
        },
      ];

  return (
    <motion.div
      ref={menuRef}
      initial={{ opacity: 0, scale: 0.92, y: -6 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.92, y: -6 }}
      transition={{ duration: 0.15, ease: "easeOut" }}
      className="absolute right-0 top-8 z-50 bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/60 py-1.5 min-w-[160px] overflow-hidden"
    >
      {items.map((item, i) => (
        <motion.button
          key={i}
          whileHover={{ backgroundColor: "rgba(241,245,249,1)" }}
          onClick={() => {
            item.onClick();
            onClose();
          }}
          className={`w-full flex items-center gap-2.5 px-4 py-2.5 text-[13px] font-semibold border-none bg-transparent cursor-pointer transition-colors ${item.color}`}
        >
          <item.icon size={14} />
          {item.label}
        </motion.button>
      ))}
    </motion.div>
  );
}

function AnswererInfo({ answerer, time, size = "md" }) {
  const nameSize = size === "sm" ? "text-[11.5px]" : "text-[13px]";
  const metaSize = size === "sm" ? "text-[10.5px]" : "text-[11.5px]";
  return (
    <div className="flex items-center gap-1.5 flex-wrap mb-1.5 min-w-0">
      <span
        className={`${nameSize} font-bold text-slate-800 flex items-center gap-1 shrink-0`}
      >
        {answerer.fullName}
        {answerer.isDoctor && <DoctorBadge />}
      </span>
      <span className={`${metaSize} text-slate-300`}>·</span>
      <span className={`${metaSize} text-blue-400 font-medium`}>
        {answerer.specialty}
      </span>
      {answerer.yearsOfExperience > 0 && (
        <>
          <span className={`${metaSize} text-slate-300`}>·</span>
          <span className={`${metaSize} text-slate-400`}>
            {answerer.yearsOfExperience}y exp
          </span>
        </>
      )}
      <span className={`ml-auto ${metaSize} text-slate-300 shrink-0`}>
        {handleTime(time)}
      </span>
    </div>
  );
}

function ReplyItem({ reply, idx, questionId, depth, onLike }) {
  const [optimisticLiked, setOptimisticLiked] = useState(
    reply.isLikedByCurrentUser,
  );
  const [optimisticCount, setOptimisticCount] = useState(reply.likesCount);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showNested, setShowNested] = useState(false);
  const [visibleNested, setVisibleNested] = useState(2);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const { accessToken } = useAuth();
  const userEmail = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1])).email
    : null;
  const isOwner = reply.answerer?.email === userEmail;

  const likeMutation = useLikeComment();
  const answerMutation = usePostAnswer();

  const { data: nestedData, isLoading: nestedLoading } = useGetCommentReplies(
    showNested ? reply.id : null,
  );
  const nestedReplies = nestedData?.items ?? [];
  const hasMoreNested = visibleNested < nestedReplies.length;

  useEffect(() => {
    if (replyOpen) inputRef.current?.focus();
  }, [replyOpen]);

  const handleLike = () => {
    setOptimisticLiked((p) => !p);
    setOptimisticCount((p) => (optimisticLiked ? p - 1 : p + 1));
    likeMutation.mutate(reply.id, {
      onError: () => {
        setOptimisticLiked((p) => !p);
        setOptimisticCount((p) => (optimisticLiked ? p + 1 : p - 1));
      },
    });
  };

  const handleSendNested = () => {
    const text = replyText.trim();
    if (!text) return;
    answerMutation.mutate(
      { id: questionId, Data: { content: text, parentAnswerId: reply.id } },
      {
        onSuccess: () => {
          setReplyText("");
          setReplyOpen(false);
          setShowNested(true);
          queryClient.invalidateQueries(["replies", reply.id]);
        },
      },
    );
  };

  const canNestFurther = depth < 2;
  const hasNestedReplies = reply.repliesCount > 0 || nestedReplies.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.25,
        delay: idx * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex gap-2 mt-3"
    >
      <div className="flex flex-col items-center flex-shrink-0">
        <AvatarIcon />
        {(hasNestedReplies || replyOpen) && canNestFurther && (
          <div className="w-0.5 flex-1 min-h-2 bg-blue-100 mt-1 rounded-full" />
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl px-3.5 py-2.5">
          <div className="flex items-start justify-between gap-2">
            <AnswererInfo
              answerer={reply.answerer}
              time={reply.createdAt}
              size="sm"
            />
            {/* Three dots */}
            <div className="relative flex-shrink-0">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setMenuOpen((v) => !v)}
                className="p-1 rounded-lg text-slate-300 hover:text-slate-500 hover:bg-white/60 transition-colors border-none bg-transparent cursor-pointer"
              >
                <FiMoreHorizontal size={13} />
              </motion.button>
              <AnimatePresence>
                {menuOpen && (
                  <ContextMenu
                    isOwner={isOwner}
                    onEdit={() => console.log("edit reply", reply.id)}
                    onDelete={() => console.log("delete reply", reply.id)}
                    onReport={() => console.log("report reply", reply.id)}
                    onClose={() => setMenuOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
          <p className="text-[12.5px] text-slate-500 leading-relaxed">
            {reply.content}
          </p>
        </div>

        <div className="flex items-center gap-0.5 pl-1 mt-1">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border-none bg-transparent cursor-pointer transition-colors
              ${optimisticLiked ? "text-rose-500" : "text-slate-300 hover:text-rose-400"}`}
          >
            {optimisticLiked ? <ImHeart size={10} /> : <FiHeart size={10} />}
            <span>{optimisticCount}</span>
          </button>

          {canNestFurther && (
            <button
              onClick={() => setReplyOpen((v) => !v)}
              className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer transition-colors
                ${replyOpen ? "text-blue-600" : "text-slate-300 hover:text-blue-500"}`}
            >
              <FiCornerDownRight size={10} />
              Reply
            </button>
          )}

          {hasNestedReplies && canNestFurther && (
            <button
              onClick={() => setShowNested((v) => !v)}
              className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[11px] font-semibold border-none cursor-pointer text-blue-400 hover:text-blue-600 bg-transparent transition-colors"
            >
              {nestedLoading ? (
                <Spinner size={10} />
              ) : showNested ? (
                <FiChevronUp size={10} />
              ) : (
                <FiChevronDown size={10} />
              )}
              {showNested ? "Hide" : `${reply.repliesCount} more`}
            </button>
          )}
        </div>

        <AnimatePresence>
          {replyOpen && canNestFurther && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden mt-2"
            >
              <div className="flex items-center gap-2">
                <AvatarIcon />
                <div className="flex-1 relative">
                  <input
                    ref={inputRef}
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleSendNested();
                    }}
                    placeholder={`Reply to ${reply.answerer.fullName.split(" ")[0]}…`}
                    className="w-full bg-blue-50/60 border border-blue-100 focus:border-blue-300 focus:bg-white rounded-xl px-3 py-1.5 pr-9 text-[12px] text-slate-700 placeholder-slate-300 outline-none transition-all"
                  />
                  <button
                    onClick={handleSendNested}
                    disabled={!replyText.trim() || answerMutation.isPending}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 rounded-md flex items-center justify-center border-none transition-all
                      ${replyText.trim() && !answerMutation.isPending ? "bg-blue-500 text-white cursor-pointer" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}
                  >
                    {answerMutation.isPending ? (
                      <Spinner size={9} />
                    ) : (
                      <FiSend size={9} />
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showNested && canNestFurther && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              {nestedLoading ? (
                <div className="flex justify-center py-3">
                  <Spinner size={14} />
                </div>
              ) : (
                <>
                  {nestedReplies.slice(0, visibleNested).map((nr, i) => (
                    <ReplyItem
                      key={nr.id}
                      reply={nr}
                      idx={i}
                      questionId={questionId}
                      depth={depth + 1}
                      onLike={onLike}
                    />
                  ))}
                  {hasMoreNested && (
                    <button
                      onClick={() => setVisibleNested((v) => v + 3)}
                      className="mt-2 ml-1 text-[11px] font-semibold text-blue-400 hover:text-blue-600 border-none bg-transparent cursor-pointer flex items-center gap-1"
                    >
                      <FiChevronDown size={11} />
                      {nestedReplies.length - visibleNested} more{" "}
                      {nestedReplies.length - visibleNested === 1
                        ? "reply"
                        : "replies"}
                    </button>
                  )}
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

function CommentItem({ comment, idx }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [visibleRepliesCount, setVisibleRepliesCount] = useState(3);
  const [menuOpen, setMenuOpen] = useState(false);
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const [optimisticLiked, setOptimisticLiked] = useState(
    comment.isLikedByCurrentUser,
  );
  const [optimisticCount, setOptimisticCount] = useState(comment.likesCount);

  const { accessToken } = useAuth();
  const userEmail = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1])).email
    : null;
  const isOwner = comment.answerer?.email === userEmail;

  const likeMutation = useLikeComment();
  const answerMutation = usePostAnswer();

  const { data: repliesData, isLoading: repliesLoading } = useGetCommentReplies(
    showReplies ? comment.id : null,
  );
  const replies = repliesData?.items ?? [];
  const visibleReplies = replies.slice(0, visibleRepliesCount);
  const hasMoreReplies = visibleRepliesCount < replies.length;

  useEffect(() => {
    if (replyOpen) inputRef.current?.focus();
  }, [replyOpen]);

  const handleLike = () => {
    setOptimisticLiked((p) => !p);
    setOptimisticCount((p) => (optimisticLiked ? p - 1 : p + 1));
    likeMutation.mutate(comment.id, {
      onError: () => {
        setOptimisticLiked((p) => !p);
        setOptimisticCount((p) => (optimisticLiked ? p + 1 : p - 1));
      },
    });
  };

  const handleSendReply = () => {
    const text = replyText.trim();
    if (!text) return;
    answerMutation.mutate(
      {
        id: comment.questionId,
        Data: { content: text, parentAnswerId: comment.id },
      },
      {
        onSuccess: () => {
          setReplyText("");
          setReplyOpen(false);
          setShowReplies(true);
          queryClient.invalidateQueries(["replies", comment.id]);
        },
      },
    );
  };

  const hasReplies = comment.repliesCount > 0 || replies.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.35,
        delay: idx * 0.04,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex gap-3">
        <div className="flex flex-col items-center flex-shrink-0">
          <AvatarIcon />
          {(hasReplies || replyOpen) && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="w-0.5 flex-1 min-h-3 bg-blue-100 mt-1.5 origin-top rounded-full"
            />
          )}
        </div>

        <div className="flex-1 min-w-0 pb-1">
          <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3.5 mb-2 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-start justify-between gap-2">
              <AnswererInfo
                answerer={comment.answerer}
                time={comment.createdAt}
              />
              {/* Three dots */}
              <div className="relative flex-shrink-0">
                <motion.button
                  whileTap={{ scale: 0.88 }}
                  onClick={() => setMenuOpen((v) => !v)}
                  className="p-1.5 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors border-none bg-transparent cursor-pointer"
                >
                  <FiMoreHorizontal size={15} />
                </motion.button>
                <AnimatePresence>
                  {menuOpen && (
                    <ContextMenu
                      isOwner={isOwner}
                      onEdit={() => console.log("edit comment", comment.id)}
                      onDelete={() => console.log("delete comment", comment.id)}
                      onReport={() => console.log("report comment", comment.id)}
                      onClose={() => setMenuOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
            <p className="text-[13.5px] text-slate-500 leading-relaxed">
              {comment.content}
            </p>
          </div>

          <div className="flex items-center gap-0.5 pl-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.88 }}
              onClick={handleLike}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[12px] font-semibold border-none cursor-pointer transition-all
                ${optimisticLiked ? "text-rose-500 bg-rose-50" : "text-slate-400 bg-transparent hover:text-rose-400 hover:bg-rose-50"}`}
            >
              {optimisticLiked ? <ImHeart size={12} /> : <FiHeart size={12} />}
              <span>{optimisticCount}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => setReplyOpen((v) => !v)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[12px] font-semibold border-none cursor-pointer transition-all
                ${replyOpen ? "text-blue-600 bg-blue-50" : "text-slate-400 bg-transparent hover:text-blue-500 hover:bg-blue-50"}`}
            >
              <FiCornerDownRight size={12} />
              Reply
            </motion.button>

            {(comment.repliesCount > 0 || replies.length > 0) && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => setShowReplies((v) => !v)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[12px] font-semibold border-none cursor-pointer text-blue-500 bg-transparent hover:bg-blue-50 transition-all"
              >
                {repliesLoading ? (
                  <Spinner size={11} />
                ) : showReplies ? (
                  <FiChevronUp size={12} />
                ) : (
                  <FiChevronDown size={12} />
                )}
                {showReplies
                  ? "Hide replies"
                  : `${comment.repliesCount} ${comment.repliesCount === 1 ? "reply" : "replies"}`}
              </motion.button>
            )}
          </div>

          <AnimatePresence>
            {replyOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -6 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden mt-2.5 pl-1"
              >
                <div className="flex items-center gap-2">
                  <AvatarIcon />
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleSendReply();
                      }}
                      placeholder={`Reply to ${comment.answerer.fullName.split(" ")[0]}…`}
                      className="w-full bg-blue-50/60 border border-blue-100 focus:border-blue-300 focus:bg-white rounded-xl px-3.5 py-2 pr-10 text-[13px] text-slate-700 placeholder-slate-300 outline-none transition-all"
                    />
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      onClick={handleSendReply}
                      disabled={!replyText.trim() || answerMutation.isPending}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center border-none transition-all
                        ${replyText.trim() && !answerMutation.isPending ? "bg-blue-500 text-white cursor-pointer shadow-sm" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}
                    >
                      {answerMutation.isPending ? (
                        <Spinner size={10} />
                      ) : (
                        <FiSend size={11} />
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {showReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28 }}
                className="overflow-hidden pl-1"
              >
                {repliesLoading ? (
                  <div className="flex justify-center py-4">
                    <Spinner size={18} />
                  </div>
                ) : (
                  <>
                    {visibleReplies.map((r, i) => (
                      <ReplyItem
                        key={r.id}
                        reply={r}
                        idx={i}
                        questionId={comment.questionId}
                        depth={0}
                        onLike={(rid) => likeMutation.mutate(rid)}
                      />
                    ))}
                    {hasMoreReplies && (
                      <motion.button
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        whileTap={{ scale: 0.97 }}
                        onClick={() => setVisibleRepliesCount((p) => p + 5)}
                        className="mt-3 ml-2 flex items-center gap-1.5 text-[12px] font-semibold text-blue-500 hover:text-blue-600 border-none bg-transparent cursor-pointer"
                      >
                        <FiChevronDown size={13} />
                        {replies.length - visibleRepliesCount} more{" "}
                        {replies.length - visibleRepliesCount === 1
                          ? "reply"
                          : "replies"}
                      </motion.button>
                    )}
                  </>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

export default function PostDetailPage() {
  const param = useParams();
  const navigate = useNavigate();
  const { data: post } = useGetQuestionById(param.id);
  const { role, accessToken } = useAuth();

  const userEmail = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1])).email
    : null;

  const isOwner = post?.patient?.email === userEmail;

  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState("");
  const [postMenuOpen, setPostMenuOpen] = useState(false);

  useEffect(() => {
    if (!post) return;
    setLiked(post.isInterestedByCurrentUser);
    setSaved(post.isSavedByCurrentUser);
    setLikes(post.interestsCount);
  }, [post]);

  const loadMoreRef = useRef(null);
  const answerMutation = usePostAnswer();

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

  const timeAgo = post?.createdAt ? handleTime(post.createdAt) : "";
  const authorName = post?.patient?.fullName;

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
          {/* ✅ Back button يستخدم useNavigate */}
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
            <span className="text-[11px] text-slate-400 font-medium">Live</span>
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

                {/* ✅ Three dots على الـ post */}
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
                      <ContextMenu
                        isOwner={isOwner}
                        onEdit={() => console.log("edit post", post?.id)}
                        onDelete={() => console.log("delete post", post?.id)}
                        onReport={() => console.log("report post", post?.id)}
                        onClose={() => setPostMenuOpen(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>

              <p className="text-[15px] text-slate-600 leading-[1.8] mb-5">
                {post?.content}
              </p>

              {post?.tags?.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-5">
                  {post.tags.map((t) => (
                    <Tag key={t} label={t} />
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
                      placeholder="Write a comment… (Enter to post)"
                      className="w-full resize-none bg-blue-50/60 border border-blue-100 focus:border-blue-300 focus:bg-white focus:ring-4 focus:ring-blue-50 rounded-2xl px-4 py-3 pr-14 text-[14px] text-slate-700 placeholder-slate-300 outline-none leading-relaxed transition-all"
                    />
                    <motion.button
                      whileTap={{ scale: 0.88 }}
                      onClick={handleAddComment}
                      disabled={!newComment.trim() || answerMutation.isPending}
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
                    {allComments.map((c, i) => (
                      <CommentItem key={c.id} comment={c} idx={i} />
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
  );
}
