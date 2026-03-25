import { motion } from "framer-motion";
import { useState } from "react";
import AvatarIcon from "../Common/AvatarIcon1";
import { FiHeart, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import {
  FaRegBookmark,
  FaBookmark,
  FaAngleUp,
  FaAngleDoubleUp,
} from "react-icons/fa";
import { ImHeart } from "react-icons/im";
import { Link } from "react-router-dom";
import ActionBtn from "../Common/ActionBtn";
import { useAuth } from "../../Context/AuthContext";
import { useLikePost } from "../../hooks/useLikePost";
import { useSavePost } from "./../../hooks/useSavePost";
import { useInterestPost } from "../../hooks/useInterestPost";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function PostCard({ post, type, onUpdate }) {
  const [liked, setLiked] = useState(
    type === "Question"
      ? post.isInterestedByCurrentUser
      : post.isLikedByCurrentUser,
  );
  const [saved, setSaved] = useState(post.isSavedByCurrentUser);
  const [likes, setLikes] = useState(
    type === "Question" ? post.interestsCount : post.likesCount,
  );
  const [expanded, setExpanded] = useState(false);

  const { role } = useAuth();
  const likeMutation = useLikePost();
  const interestMutation = useInterestPost();
  const saveMutation = useSavePost(type);

  // ── time formatting ──
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

  // ── body ──
  console.log(post);
  const bodyText = post.content ? post.content : post.text;
  const isLong = bodyText.length > 140;
  const body = !expanded && isLong ? bodyText.slice(0, 140) + "…" : bodyText;

  // ── handlers ──
  const handleLike = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    onUpdate("liked", liked ? "dec" : "inc");
    likeMutation.mutate(post.id);
  };

  const handleInterest = () => {
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    onUpdate("liked", liked ? "dec" : "inc");
    interestMutation.mutate(post.id);
  };

  const handleSave = () => {
    setSaved((prev) => !prev);
    onUpdate("saved", saved ? "dec" : "inc");
    saveMutation.mutate(post.id);
  };

  // ── render like/interest action ──
  const renderLikeAction = () => {
    if (type === "Artical") {
      // ✅ Article → Like للكل (Doctor + Patient)
      return (
        <ActionBtn
          // ✅ الأيقونة بتتغير حسب الحالة
          iconActive={ImHeart}
          iconInactive={FiHeart}
          label="Like"
          labelInActive="Liked"
          active={liked}
          activeClass="text-rose-500"
          onClick={handleLike}
        />
      );
    }

    if (type === "Question" && role === "Patient") {
      // ✅ Question + Patient → Interest
      return (
        <ActionBtn
          // ✅ الأيقونة بتتغير حسب الحالة
          iconActive={FaAngleDoubleUp}
          iconInactive={FaAngleUp}
          label="Interest"
          labelInActive="Interested"
          active={liked}
          activeClass="text-blue-600"
          onClick={handleInterest}
        />
      );
    }

    // Doctor على Question → مفيش زرار
    return null;
  };

  return (
    <motion.article
      variants={fadeUp}
      whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(14,99,255,0.13)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <AvatarIcon />
          <div>
            <p className="font-bold text-slate-800 text-sm leading-tight">
              {type === "Question"
                ? post.patient.fullName
                : `Dr.${post.doctor.fullName}`}
            </p>
            <p className="text-xs text-slate-400">
              {type === "Artical" && post.doctor.specialty + " · "}
              {timeAgo}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[10px] font-bold tracking-widest text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            {type}
          </span>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <FiMoreHorizontal size={16} />
          </button>
        </div>
      </div>

      {/* Body */}
      <p className="text-sm text-slate-600 leading-relaxed mb-3">
        {body}
        {isLong && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-1 cursor-pointer text-blue-500 font-bold hover:text-blue-700 transition-colors"
          >
            {expanded ? "less" : "more"}
          </button>
        )}
      </p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {post.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full"
            >
              #{t}
            </span>
          ))}
        </div>
      )}

      {/* Stats */}
      {/* Stats */}
      <div className="flex items-center gap-4 mb-3">
        <div className="flex items-center gap-1.5">
          {/* ✅ ثابتة دايمًا - مش بتتغير حسب liked */}
          {type === "Question" ? (
            <FaAngleDoubleUp size={13} className="text-blue-500" />
          ) : (
            <ImHeart size={13} className="text-rose-400" />
          )}

          <span className="text-xs font-semibold text-slate-600">{likes}</span>
          <span className="text-xs text-slate-400">
            {type === "Question" ? "interested" : "likes"}
          </span>
        </div>

        {type === "Question" && (
          <div className="flex items-center gap-1.5">
            <FiMessageCircle size={13} className="text-blue-400" />
            <span className="text-xs font-semibold text-slate-600">
              {post.answersCount}
            </span>
            <span className="text-xs text-slate-400">answers</span>
          </div>
        )}
      </div>
      <div className="h-px bg-blue-50 mb-3" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {renderLikeAction()}

          {type === "Question" && (
            <Link to={`/Community/Question/${post.id}`}>
              <ActionBtn
                iconActive={FiMessageCircle}
                iconInactive={FiMessageCircle}
                label="Answer"
                count={post.comments}
              />
            </Link>
          )}
        </div>

        {/* Save للكل */}
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={handleSave}
          className={`p-2 rounded-xl cursor-pointer transition-colors ${
            saved
              ? "text-blue-600 bg-blue-50"
              : "text-slate-400 hover:text-blue-500 hover:bg-blue-50"
          }`}
        >
          {saved ? <FaBookmark size={17} /> : <FaRegBookmark size={17} />}
        </motion.button>
      </div>
    </motion.article>
  );
}
