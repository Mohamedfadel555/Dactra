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

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

export default function PostCard({ post, type, onUpdate }) {
  const [liked, setLiked] = useState(post.isLikedByCurrentUser);
  const [saved, setSaved] = useState(post.isSavedByCurrentUser);
  const [likes, setLikes] = useState(post.likesCount);
  const [expanded, setExpanded] = useState(false);

  const now = new Date();
  const createAt = new Date(post.createdAt);
  const diff = now - createAt;
  const diffMinutes = diff / (1000 * 60);
  const diffHours = diff / (1000 * 60 * 60);
  const diffDays = diff / (1000 * 60 * 60 * 24);
  const diffWeeks = diff / (1000 * 60 * 60 * 24 * 7);
  const diffMonths = diff / (1000 * 60 * 60 * 24 * 30);
  const diffYears = diff / (1000 * 60 * 60 * 24 * 30 * 12);

  const { role } = useAuth();

  const isLong = post.content.length > 140;
  const body =
    !expanded && isLong ? post.content.slice(0, 140) + "…" : post.content;

  const likeMutation = useLikePost();
  const saveMutation = useSavePost();

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
              Dr.{post.doctor.fullName}
            </p>
            <p className="text-xs text-slate-400">
              {post.doctor.specialty} ·{" "}
              {diffYears >= 1
                ? Math.floor(diffYears) + "y"
                : diffMonths >= 1
                  ? Math.floor(diffMonths) + "mo"
                  : diffWeeks >= 1
                    ? Math.floor(diffWeeks) + "w"
                    : diffDays >= 1
                      ? Math.floor(diffDays) + "d"
                      : diffHours >= 1
                        ? Math.floor(diffHours) + "h"
                        : diffMinutes >= 1
                          ? Math.floor(diffMinutes) + "m"
                          : "now"}
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
      <div className="flex flex-wrap gap-2 mb-4">
        {post.tags.length > 0 &&
          post.tags.map((t) => (
            <span
              key={t}
              className="text-xs font-semibold text-blue-600 bg-blue-50 border border-blue-100 px-3 py-0.5 rounded-full"
            >
              #{t}
            </span>
          ))}
      </div>

      {/* ── Stats bar ── */}
      <div className="flex items-center gap-4 mb-3">
        {/* Likes count */}
        <div className="flex items-center gap-1.5">
          <ImHeart size={13} className="text-rose-400" />
          <span className="text-xs font-semibold text-slate-600">{likes}</span>
          <span className="text-xs text-slate-400">likes</span>
        </div>

        {/* Comments count — hidden for Articles */}
        {type !== "Artical" && (
          <div className="flex items-center gap-1.5">
            <FiMessageCircle size={13} className="text-blue-400" />
            <span className="text-xs font-semibold text-slate-600">
              {post.comments}
            </span>
            <span className="text-xs text-slate-400">comments</span>
          </div>
        )}
      </div>

      <div className="h-px bg-blue-50 mb-3" />

      {/* Actions */}
      <div className="flex items-center justify-between">
        <div className="flex gap-1">
          {type === "Artical" ? (
            <ActionBtn
              iconActive={ImHeart}
              iconInactive={FiHeart}
              label="Like"
              labelInActive="Liked"
              active={liked}
              activeClass="text-rose-500"
              onClick={() => {
                setLiked(!liked);
                liked ? onUpdate("liked", "dec") : onUpdate("liked", "inc");
                setLikes(liked ? likes - 1 : likes + 1);
                likeMutation.mutate(post.id);
              }}
            />
          ) : role === "Patient" ? (
            <ActionBtn
              iconActive={FaAngleDoubleUp}
              iconInactive={FaAngleUp}
              label="interest"
              labelInActive="interested"
              active={liked}
              activeClass="text-blue-600"
              onClick={() => {
                setLiked(!liked);
                setLikes(liked ? likes - 1 : likes + 1);
              }}
            />
          ) : null}
          {type === "Artical" ? null : (
            <Link to={"/Community/Post"}>
              <ActionBtn
                iconActive={FiMessageCircle}
                iconInactive={FiMessageCircle}
                label="Comments"
                count={post.comments}
              />
            </Link>
          )}
        </div>
        <motion.button
          whileTap={{ scale: 0.85 }}
          onClick={() => {
            setSaved(!saved);
            saved ? onUpdate("saved", "dec") : onUpdate("saved", "inc");
            saveMutation.mutate(post.id);
          }}
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
