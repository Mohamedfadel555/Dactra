import { motion } from "framer-motion";
import { useState } from "react";
import AvatarIcon from "../Common/AvatarIcon1";
import { FiHeart, FiMessageCircle, FiMoreHorizontal } from "react-icons/fi";
import { FaRegBookmark, FaBookmark } from "react-icons/fa";
import { ImHeart } from "react-icons/im";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

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

export default function PostCard({ post, type }) {
  const [liked, setLiked] = useState(post.liked);
  const [saved, setSaved] = useState(post.saved);
  const [likes, setLikes] = useState(post.likes);
  const [expanded, setExpanded] = useState(false);

  const isLong = post.content.length > 140;
  const body =
    !expanded && isLong ? post.content.slice(0, 140) + "…" : post.content;

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
              {post.author}
            </p>
            <p className="text-xs text-slate-400">
              {post.specialty} · {post.time}
            </p>
          </div>
        </div>
        {/* <div className="flex items-center gap-2">
          <span className="hidden sm:inline text-[10px] font-bold tracking-widest text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
            Artical
          </span>
          <button className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition-colors">
            <FiMoreHorizontal size={16} />
          </button>
        </div> */}
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

      <div className="h-px bg-blue-50 mb-3" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          <ActionBtn
            iconActive={ImHeart}
            iconInactive={FiHeart}
            label="Like"
            active={liked}
            activeClass="text-rose-500"
            count={likes}
            onClick={() => {
              setLiked(!liked);
              setLikes(liked ? likes - 1 : likes + 1);
            }}
          />
          <ActionBtn
            iconActive={FiMessageCircle}
            iconInactive={FiMessageCircle}
            label="Comment"
            count={post.comments}
          />
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => setSaved(!saved)}
          className={`p-2 rounded-xl cursor-pointer transition-colors ${saved ? "text-blue-600 bg-blue-50" : "text-slate-400 hover:text-blue-500 hover:bg-blue-50"}`}
        >
          {saved ? <FaBookmark size={17} /> : <FaRegBookmark size={17} />}
        </motion.button>
      </div>
    </motion.article>
  );
}
