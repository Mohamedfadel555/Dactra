import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import {
  FiHeart,
  FiMessageCircle,
  FiArrowLeft,
  FiSend,
  FiMoreHorizontal,
  FiCornerDownRight,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import {
  FaRegBookmark,
  FaBookmark,
  FaAngleDoubleUp,
  FaAngleUp,
} from "react-icons/fa";
import { ImHeart } from "react-icons/im";
import { useLocation } from "react-router-dom";
import AvatarIcon from "../../Components/Common/AvatarIcon1";

/* ── Avatar ─────────────────────────────────────────────────────── */
const AVATAR_COLORS = [
  "from-blue-500 to-blue-600",
  "from-cyan-500 to-blue-500",
  "from-indigo-500 to-blue-500",
  "from-blue-400 to-cyan-500",
  "from-sky-500 to-blue-600",
  "from-blue-600 to-indigo-600",
];

function Avatar({ name = "U", size = "md", idx = 0 }) {
  const initials = name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  const sizeClass = {
    sm: "w-7 h-7 text-[10px]",
    md: "w-9 h-9 text-xs",
    lg: "w-11 h-11 text-sm",
  }[size];
  return (
    <div
      className={`${sizeClass} flex-shrink-0 rounded-full bg-gradient-to-br ${AVATAR_COLORS[idx % AVATAR_COLORS.length]} flex items-center justify-center font-bold text-white shadow-md`}
    >
      {initials}
    </div>
  );
}

/* ── Tag ────────────────────────────────────────────────────────── */
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

/* ── Reply Item ─────────────────────────────────────────────────── */
function ReplyItem({ reply, idx, onLike }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8, x: -4 }}
      animate={{ opacity: 1, y: 0, x: 0 }}
      transition={{
        duration: 0.3,
        delay: idx * 0.06,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="flex gap-2.5 mt-3"
    >
      <Avatar name={reply.author} size="sm" idx={reply.colorIdx} />
      <div className="flex-1 min-w-0">
        <div className="bg-blue-50/60 border border-blue-100 rounded-2xl px-3.5 py-2.5">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[12px] font-bold text-slate-700">
              {reply.author}
            </span>
            <span className="text-[11px] text-slate-400">
              {reply.specialty}
            </span>
            <span className="ml-auto text-[11px] text-slate-300">
              {reply.time}
            </span>
          </div>
          <p className="text-[13px] text-slate-500 leading-relaxed">
            {reply.text}
          </p>
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => onLike(reply.id)}
          className={`flex items-center gap-1.5 mt-1.5 ml-2 text-[11px] font-semibold border-none bg-transparent cursor-pointer transition-colors
            ${reply.liked ? "text-rose-500" : "text-slate-300 hover:text-rose-400"}`}
        >
          {reply.liked ? <ImHeart size={11} /> : <FiHeart size={11} />}
          <span>{reply.likes}</span>
        </motion.button>
      </div>
    </motion.div>
  );
}

/* ── Comment Item ───────────────────────────────────────────────── */
function CommentItem({ comment, idx, onLikeComment, onLikeReply, onAddReply }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const inputRef = useRef(null);

  useEffect(() => {
    if (replyOpen) inputRef.current?.focus();
  }, [replyOpen]);

  const handleReply = () => {
    if (!replyText.trim()) return;
    onAddReply(comment.id, replyText.trim());
    setReplyText("");
    setShowReplies(true);
    setReplyOpen(false);
  };

  const hasReplies = comment.replies?.length > 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: idx * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
    >
      <div className="flex gap-3">
        {/* Thread line col */}
        <div className="flex flex-col items-center flex-shrink-0">
          <Avatar name={comment.author} size="md" idx={comment.colorIdx} />
          {(hasReplies || replyOpen) && (
            <motion.div
              initial={{ scaleY: 0 }}
              animate={{ scaleY: 1 }}
              transition={{ duration: 0.3, delay: 0.15 }}
              className="w-0.5 flex-1 min-h-3 bg-blue-100 mt-1.5 origin-top rounded-full"
            />
          )}
        </div>

        {/* Content col */}
        <div className="flex-1 min-w-0 pb-1">
          {/* Bubble */}
          <div className="bg-white border border-slate-100 rounded-2xl px-4 py-3.5 mb-2 shadow-sm hover:shadow-md transition-shadow duration-300">
            <div className="flex items-baseline gap-2 mb-1.5 flex-wrap">
              <span className="text-[13.5px] font-bold text-slate-800">
                {comment.author}
              </span>
              <span className="text-[11.5px] text-blue-400 font-medium">
                {comment.specialty}
              </span>
              <span className="ml-auto text-[11px] text-slate-300">
                {comment.time}
              </span>
            </div>
            <p className="text-[13.5px] text-slate-500 leading-relaxed">
              {comment.text}
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-0.5 pl-1">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => onLikeComment(comment.id)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[12px] font-semibold border-none cursor-pointer transition-all
                ${comment.liked ? "text-rose-500 bg-rose-50" : "text-slate-400 bg-transparent hover:text-rose-400 hover:bg-rose-50"}`}
            >
              {comment.liked ? <ImHeart size={12} /> : <FiHeart size={12} />}
              <span>{comment.likes}</span>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.88 }}
              onClick={() => setReplyOpen(!replyOpen)}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[12px] font-semibold border-none cursor-pointer transition-all
                ${replyOpen ? "text-blue-600 bg-blue-50" : "text-slate-400 bg-transparent hover:text-blue-500 hover:bg-blue-50"}`}
            >
              <FiCornerDownRight size={12} />
              <span>Reply</span>
            </motion.button>

            {hasReplies && (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => setShowReplies(!showReplies)}
                className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-[12px] font-semibold border-none cursor-pointer text-blue-500 bg-transparent hover:bg-blue-50 transition-all"
              >
                {showReplies ? (
                  <FiChevronUp size={12} />
                ) : (
                  <FiChevronDown size={12} />
                )}
                {showReplies
                  ? "Hide"
                  : `${comment.replies.length} ${comment.replies.length > 1 ? "replies" : "reply"}`}
              </motion.button>
            )}
          </div>

          {/* Reply input */}
          <AnimatePresence>
            {replyOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -8 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{ opacity: 0, height: 0, y: -8 }}
                transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden mt-2.5 pl-1"
              >
                <div className="flex items-center gap-2">
                  <Avatar name="You" size="sm" idx={0} />
                  <div className="flex-1 relative">
                    <input
                      ref={inputRef}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") handleReply();
                      }}
                      placeholder={`Reply to ${comment.author.split(" ")[0]}…`}
                      className="w-full bg-blue-50/60 border border-blue-100 focus:border-blue-300 focus:bg-white rounded-xl px-3.5 py-2 pr-10 text-[13px] text-slate-700 placeholder-slate-300 outline-none transition-all"
                    />
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.85 }}
                      onClick={handleReply}
                      disabled={!replyText.trim()}
                      className={`absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 rounded-lg flex items-center justify-center border-none transition-all
                        ${replyText.trim() ? "bg-blue-500 text-white cursor-pointer shadow-sm" : "bg-slate-100 text-slate-300 cursor-not-allowed"}`}
                    >
                      <FiSend size={11} />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Nested Replies */}
          <AnimatePresence>
            {showReplies && hasReplies && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden pl-1"
              >
                {comment.replies.map((r, i) => (
                  <ReplyItem
                    key={r.id}
                    reply={r}
                    idx={i}
                    onLike={(rid) => onLikeReply(comment.id, rid)}
                  />
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}

/* ── Data ───────────────────────────────────────────────────────── */
const POST = {
  author: "Dr. Sarah Khalil",
  specialty: "Cardiology",
  time: "2h ago",
  liked: false,
  saved: false,
  likes: 142,
  tags: ["cardiology", "research", "heartfailure"],
  content:
    "New findings suggest that early intervention with SGLT2 inhibitors in heart failure patients with preserved ejection fraction significantly reduces hospitalization rates. Our multi-center study of 1,200 patients over 18 months shows a 34% reduction in adverse cardiac events. This represents a major shift in how we approach HFpEF management. The data is compelling and I believe we'll see updated guidelines reflecting this soon. Would love to hear thoughts from fellow cardiologists on implementation strategies in routine clinical practice.",
};

const SEED_COMMENTS = [
  {
    id: 1,
    colorIdx: 1,
    author: "Dr. Omar Farouk",
    specialty: "Internal Medicine",
    time: "1h ago",
    text: "Fascinating results! The 34% reduction is remarkable. Did you stratify by age groups? I've noticed different responses in elderly patients in my practice.",
    liked: false,
    likes: 12,
    replies: [
      {
        id: 101,
        colorIdx: 0,
        author: "Dr. Sarah Khalil",
        specialty: "Cardiology",
        time: "55m ago",
        text: "Great question Omar! Yes — patients >75 showed a slightly attenuated but still significant 28% reduction.",
        liked: false,
        likes: 7,
      },
      {
        id: 102,
        colorIdx: 3,
        author: "Dr. Nadia Samy",
        specialty: "Cardiology",
        time: "40m ago",
        text: "This matches our anecdotal observations. The elderly cohort is tricky due to polypharmacy.",
        liked: false,
        likes: 3,
      },
    ],
  },
  {
    id: 2,
    colorIdx: 2,
    author: "Dr. Nadia Samy",
    specialty: "Cardiology",
    time: "45m ago",
    text: "Thank you for sharing, Dr. Khalil. We've been hesitant due to cost concerns in our region. Any data on cost-effectiveness?",
    liked: false,
    likes: 8,
    replies: [
      {
        id: 201,
        colorIdx: 0,
        author: "Dr. Sarah Khalil",
        specialty: "Cardiology",
        time: "38m ago",
        text: "We're preparing a health economics sub-analysis — should be ready in Q1. Happy to share the draft.",
        liked: false,
        likes: 4,
      },
    ],
  },
  {
    id: 3,
    colorIdx: 4,
    author: "Dr. Karim Hassan",
    specialty: "Pharmacology",
    time: "30m ago",
    text: "Is the benefit primarily volume regulation or direct myocardial effects? This debate is very much alive in the current literature.",
    liked: false,
    likes: 5,
    replies: [],
  },
  {
    id: 4,
    colorIdx: 5,
    author: "Dr. Layla Mostafa",
    specialty: "Research Fellow",
    time: "15m ago",
    text: "Would love to see the full paper when published. This aligns well with the EMPEROR-Preserved trial data.",
    liked: false,
    likes: 3,
    replies: [],
  },
];

/* ── Main Page ──────────────────────────────────────────────────── */
export default function PostDetailPage({ onBack }) {
  const { state } = useLocation();
  const post = state?.post;
  console.log(post);
  const [liked, setLiked] = useState(post.isInterestedByCurrentUser);
  const [saved, setSaved] = useState(post.isSavedByCurrentUser);
  const [likes, setLikes] = useState(post.interestsCount);
  const [comments, setComments] = useState(SEED_COMMENTS);
  const [newComment, setNewComment] = useState("");
  const bottomRef = useRef(null);

  const totalComments = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0,
  );

  const handleAddComment = () => {
    const text = newComment.trim();
    if (!text) return;
    setComments((prev) => [
      ...prev,
      {
        id: Date.now(),
        colorIdx: 0,
        author: "You",
        specialty: "General",
        time: "Just now",
        text,
        liked: false,
        likes: 0,
        replies: [],
      },
    ]);
    setNewComment("");
    setTimeout(
      () => bottomRef.current?.scrollIntoView({ behavior: "smooth" }),
      100,
    );
  };

  const handleLikeComment = (cid) =>
    setComments((prev) =>
      prev.map((c) =>
        c.id !== cid
          ? c
          : {
              ...c,
              liked: !c.liked,
              likes: c.liked ? c.likes - 1 : c.likes + 1,
            },
      ),
    );

  const handleLikeReply = (cid, rid) =>
    setComments((prev) =>
      prev.map((c) =>
        c.id !== cid
          ? c
          : {
              ...c,
              replies: c.replies.map((r) =>
                r.id !== rid
                  ? r
                  : {
                      ...r,
                      liked: !r.liked,
                      likes: r.liked ? r.likes - 1 : r.likes + 1,
                    },
              ),
            },
      ),
    );

  const handleAddReply = (cid, text) =>
    setComments((prev) =>
      prev.map((c) =>
        c.id !== cid
          ? c
          : {
              ...c,
              replies: [
                ...(c.replies || []),
                {
                  id: Date.now(),
                  colorIdx: 0,
                  author: "You",
                  specialty: "General",
                  time: "Just now",
                  text,
                  liked: false,
                  likes: 0,
                },
              ],
            },
      ),
    );

  const now = new Date();
  const createAt = new Date(post.createdAt);

  const diff = now - createAt;
  const diffMinutes = diff / (1000 * 60);
  const diffHours = diff / (1000 * 60 * 60);
  const diffDays = diff / (1000 * 60 * 60 * 24);
  const diffWeeks = diff / (1000 * 60 * 60 * 24 * 7);
  const diffMonths = diff / (1000 * 60 * 60 * 24 * 30);
  const diffYears = diff / (1000 * 60 * 60 * 24 * 30 * 12);

  const timeAgo =
    diffYears >= 1
      ? Math.floor(diffYears) + "y ago"
      : diffMonths >= 1
        ? Math.floor(diffMonths) + "mo ago"
        : diffWeeks >= 1
          ? Math.floor(diffWeeks) + "w ago"
          : diffDays >= 1
            ? Math.floor(diffDays) + "d ago"
            : diffHours >= 1
              ? Math.floor(diffHours) + "h ago"
              : diffMinutes >= 1
                ? Math.floor(diffMinutes) + "m ago"
                : "now";

  return (
    <div className=" pt-[60px] min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/40 to-white">
      {/* Decorative top accent */}
      <div className="h-1 w-full" />

      {/* ── Sticky Header ── */}
      <motion.header
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="sticky top-[60px] z-30 px-5 pt-2 flex items-center gap-3"
      >
        <motion.button
          whileHover={{ scale: 1.04, x: -2 }}
          whileTap={{ scale: 0.94 }}
          onClick={onBack}
          className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-blue-50 border border-blue-100 text-blue-600 text-[13px] font-semibold cursor-pointer hover:bg-blue-100 transition-colors"
        >
          <FiArrowLeft size={14} /> Back
        </motion.button>
        <div className="w-px h-5 bg-slate-200" />
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
          <span className="text-sm font-semibold text-slate-600">Question</span>
        </div>
      </motion.header>

      <div className="max-w-2xl mx-auto px-4  pb-16 space-y-4">
        {/* ── Post Card ── */}
        <motion.article
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          {/* Blue top stripe */}
          <div className="h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />

          <div className="p-6">
            {/* Author */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <AvatarIcon />
                <div>
                  <p className="text-[14.5px] font-bold text-slate-800 leading-tight">
                    {post.patient.fullName}
                  </p>
                  <p className="text-xs text-slate-400 mt-0.5">{timeAgo}</p>
                </div>
              </div>
              <button className="p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors cursor-pointer border-none bg-transparent">
                <FiMoreHorizontal size={18} />
              </button>
            </div>

            {/* Content */}
            <p className="text-[15px] text-slate-600 leading-[1.8] mb-5">
              {post.content}
            </p>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-5">
              {post.tags.map((t) => (
                <Tag key={t} label={t} />
              ))}
            </div>

            {/* Divider */}
            <div className="h-px bg-slate-100 mb-4" />

            {/* Action buttons */}
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  onClick={() => {
                    setLiked(!liked);
                    setLikes(liked ? likes - 1 : likes + 1);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold border-none cursor-pointer transition-all
    ${liked ? "text-blue-600 bg-blue-50 shadow-sm" : "text-slate-500 bg-slate-50 hover:bg-blue-50 hover:text-blue-600"}`}
                >
                  {liked ? (
                    <FaAngleDoubleUp size={15} />
                  ) : (
                    <FaAngleUp size={15} />
                  )}
                  <span>{likes}</span>
                  <span className="hidden sm:inline">Interest</span>
                </motion.button>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className="flex items-center gap-2 px-4 py-2 rounded-xl text-[13px] font-semibold text-blue-600 bg-blue-50 border-none cursor-default"
                >
                  <FiMessageCircle size={15} />
                  <span>{totalComments}</span>
                  <span className="hidden sm:inline">Comments</span>
                </motion.button>
              </div>

              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.88 }}
                onClick={() => setSaved(!saved)}
                className={`p-2.5 rounded-xl border cursor-pointer transition-all
                  ${saved ? "text-blue-600 bg-blue-50 border-blue-200 shadow-sm" : "text-slate-400 bg-slate-50 border-slate-200 hover:text-blue-500 hover:bg-blue-50 hover:border-blue-200"}`}
              >
                {saved ? <FaBookmark size={16} /> : <FaRegBookmark size={16} />}
              </motion.button>
            </div>
          </div>
        </motion.article>

        {/* ── Comments Section ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.12, ease: [0.22, 1, 0.36, 1] }}
          className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
        >
          {/* Section header */}
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
            {/* Comments list */}
            {comments.map((c, i) => (
              <CommentItem
                key={c.id}
                comment={c}
                idx={i}
                onLikeComment={handleLikeComment}
                onLikeReply={handleLikeReply}
                onAddReply={handleAddReply}
              />
            ))}

            {/* Divider */}
            <div
              ref={bottomRef}
              className="h-px bg-gradient-to-r from-transparent via-blue-100 to-transparent"
            />

            {/* ── New Comment ── */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex gap-3 items-end"
            >
              <Avatar name="You" size="md" idx={0} />
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
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.88 }}
                  onClick={handleAddComment}
                  disabled={!newComment.trim()}
                  className={`absolute right-3 bottom-3 w-9 h-9 rounded-xl flex items-center justify-center border-none transition-all
                    ${
                      newComment.trim()
                        ? "bg-blue-500 text-white cursor-pointer shadow-md shadow-blue-200 hover:bg-blue-600"
                        : "bg-slate-100 text-slate-300 cursor-not-allowed"
                    }`}
                >
                  <FiSend size={14} />
                </motion.button>
              </div>
            </motion.div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
