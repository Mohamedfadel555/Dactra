import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import AvatarIcon from "../Common/AvatarIcon1";
import {
  FiHeart,
  FiMessageCircle,
  FiMoreHorizontal,
  FiX,
  FiZoomIn,
} from "react-icons/fi";
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
import Tag from "./Tag";
import PostMenu from "./PostMenu";
import { useDeletePost } from "../../hooks/useDeletePost";
import { useEditQuestion } from "../../hooks/useEditQuestion";
import { useEditPost } from "../../hooks/useEditPost";
import EditModal from "./EditModal";
import ReportModal from "../Common/ReportModal";
import { toast } from "react-toastify";
import { REPORT_TYPE } from "../../utils/reportConstants";
import { useReportApi } from "../../hooks/useReportApi";
import { useNotificationsApi } from "../../hooks/useNotificationsApi";
import { avatarUserFromAuthor } from "../../utils/communityAvatars";

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.4, ease: "easeOut" } },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.25, ease: "easeOut" } },
  exit: { opacity: 0, transition: { duration: 0.2, ease: "easeIn" } },
};

const imageVariants = {
  hidden: { opacity: 0, scale: 0.92, y: 16 },
  show: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
  },
  exit: {
    opacity: 0,
    scale: 0.94,
    y: 8,
    transition: { duration: 0.2, ease: "easeIn" },
  },
};

export default function PostCard({ post, type, onUpdate }) {
  console.log(post);
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
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [imageOpen, setImageOpen] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // optimistic content update
  const [displayContent, setDisplayContent] = useState(
    post.content ?? post.text ?? "",
  );

  const { role, accessToken } = useAuth();
  const userEmail = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1])).email
    : null;

  const isOwner = post?.email === userEmail;

  const likeMutation = useLikePost();
  const interestMutation = useInterestPost();
  const saveMutation = useSavePost(type);
  const deletePostMutation = useDeletePost(type);
  const editQuestionMutation = useEditQuestion();
  const editPostMutation = useEditPost();

  const editMutation =
    type === "Question" ? editQuestionMutation : editPostMutation;

  const { createReport } = useReportApi();
  const { notifySentToDoctor } = useNotificationsApi();
  const queryClient = useQueryClient();

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

  const isLong = displayContent.length > 140;
  const body =
    !expanded && isLong ? displayContent.slice(0, 140) + "…" : displayContent;

  const avatarUser = avatarUserFromAuthor(
    type === "Question" ? post.patient : post.doctor,
  );

  const handleLike = () => {
    const wasLiked = liked;
    setLiked((prev) => !prev);
    setLikes((prev) => (liked ? prev - 1 : prev + 1));
    onUpdate("liked", liked ? "dec" : "inc");
    likeMutation.mutate(post.id, {
      onSuccess: () => {
        if (type === "Artical" && !isOwner && !wasLiked) {
          notifySentToDoctor(post.id, {
            title: "New like",
            message: "Someone liked your article.",
          })
            .then(() => {
              queryClient.invalidateQueries({ queryKey: ["notifications"] });
            })
            .catch(() => {});
        }
      },
    });
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

  const handleDelete = () => {
    deletePostMutation.mutate(post.id);
  };

  const handleReport = () => {
    setReportOpen(true);
  };

  const handleSubmitReport = async ({ reason, details }) => {
    const reportType =
      type === "Question" ? REPORT_TYPE.QUESTION : REPORT_TYPE.POST;
    setReportSubmitting(true);
    try {
      await createReport({
        type: reportType,
        title: reason,
        content: (details || "").trim(),
        relatedEntityId: post.id,
      });
      setReportOpen(false);
      toast.success("Report submitted.", { position: "top-center" });
    } catch {
      toast.error("Could not submit report.", { position: "top-center" });
    } finally {
      setReportSubmitting(false);
    }
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

  const renderLikeAction = () => {
    if (type === "Artical") {
      return (
        <ActionBtn
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
      return (
        <ActionBtn
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
    return null;
  };

  return (
    <>
      <motion.article
        variants={fadeUp}
        whileHover={{ y: -3, boxShadow: "0 12px 40px rgba(14,99,255,0.13)" }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl p-5 border border-blue-50 shadow-sm"
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3">
            <AvatarIcon user={avatarUser} showLabel={false} />
            <div>
              <p className="font-bold text-slate-800 text-sm leading-tight">
                {type === "Question"
                  ? post.patient?.fullName
                  : `Dr.${post.doctor?.fullName}`}
              </p>
              <p className="text-xs text-slate-400">
                {type === "Artical" && post.doctor?.specialty + " · "}
                {timeAgo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="hidden sm:inline text-[10px] font-bold tracking-widest text-blue-500 bg-blue-50 border border-blue-100 px-3 py-1 rounded-full">
              {type}
            </span>

            <div className="relative">
              <motion.button
                whileTap={{ scale: 0.88 }}
                onClick={() => setMenuOpen((v) => !v)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 transition-colors border-none bg-transparent cursor-pointer"
              >
                <FiMoreHorizontal size={16} />
              </motion.button>

              <AnimatePresence>
                {menuOpen && (
                  <PostMenu
                    isOwner={isOwner}
                    onEdit={() => {
                      setMenuOpen(false);
                      setEditOpen(true);
                    }}
                    onDelete={handleDelete}
                    onReport={handleReport}
                    onClose={() => setMenuOpen(false)}
                  />
                )}
              </AnimatePresence>
            </div>
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

        {/* Post Image */}
        {post.imageUrl && (
          <motion.div
            whileHover="hover"
            onClick={() => {
              setImageLoaded(false);
              setImageOpen(true);
            }}
            className="relative mb-3 rounded-xl overflow-hidden border border-blue-50 cursor-zoom-in group"
          >
            <img
              src={post.imageUrl}
              alt="post"
              className="w-full object-cover max-h-80 transition-transform duration-500 group-hover:scale-[1.02]"
            />
            {/* hover overlay hint */}
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/90 backdrop-blur-sm rounded-full p-2.5 shadow-lg">
                <FiZoomIn size={18} className="text-slate-700" />
              </div>
            </div>
          </motion.div>
        )}

        {/* Tags */}
        {post.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {post.tags.map((t) => (
              <Tag key={t.id} label={t.name} id={t.id} type={type} />
            ))}
          </div>
        )}

        <div className="flex items-center gap-4 mb-3">
          <div className="flex items-center gap-1.5">
            {type === "Question" ? (
              <FaAngleDoubleUp size={13} className="text-blue-500" />
            ) : (
              <ImHeart size={13} className="text-rose-400" />
            )}
            <span className="text-xs font-semibold text-slate-600">
              {likes}
            </span>
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
              <Link to={`/Community/Question/${post.id}`} state={{ type }}>
                <ActionBtn
                  iconActive={FiMessageCircle}
                  iconInactive={FiMessageCircle}
                  label="Answer"
                  count={post.comments}
                />
              </Link>
            )}
          </div>

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

      {/* Image Lightbox */}
      <AnimatePresence>
        {imageOpen && (
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate="show"
            exit="exit"
            onClick={() => setImageOpen(false)}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            style={{
              backgroundColor: "rgba(2, 8, 23, 0.85)",
              backdropFilter: "blur(6px)",
            }}
          >
            {/* Close button */}
            <motion.button
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15 } }}
              exit={{ opacity: 0 }}
              onClick={() => setImageOpen(false)}
              className="absolute top-4 right-4 z-10 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-full p-2.5 transition-colors cursor-pointer backdrop-blur-sm"
            >
              <FiX size={18} />
            </motion.button>

            {/* Image container */}
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full"
            >
              {/* Loading skeleton */}
              {!imageLoaded && (
                <div className="w-full h-64 rounded-2xl bg-white/10 animate-pulse" />
              )}

              <img
                src={post.imageUrl}
                alt="post full"
                onLoad={() => setImageLoaded(true)}
                className={`w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl transition-opacity duration-300 ${
                  imageLoaded ? "opacity-100" : "opacity-0 absolute inset-0"
                }`}
              />

              {/* Bottom info bar */}
              {imageLoaded && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: 0.1 } }}
                  className="mt-3 flex items-center justify-between px-1"
                >
                  <div className="flex items-center gap-2">
                    <AvatarIcon user={avatarUser} showLabel={false} />
                    <span className="text-white/80 text-sm font-medium">
                      {type === "Question"
                        ? post.patient?.fullName
                        : `Dr. ${post.doctor?.fullName}`}
                    </span>
                  </div>
                  <span className="text-white/40 text-xs">{timeAgo}</span>
                </motion.div>
              )}
            </motion.div>

            {/* Tap outside hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { delay: 0.4 } }}
              className="absolute bottom-4 left-0 right-0 text-center text-white/30 text-xs pointer-events-none"
            >
              tap outside to close
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Edit Modal */}
      <EditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialText={displayContent}
        onSave={handleEditSave}
        isPending={editMutation.isPending}
        title={type === "Question" ? "Edit Question" : "Edit Article"}
      />
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleSubmitReport}
        isSubmitting={reportSubmitting}
        contentLabel={type === "Question" ? "question" : "article"}
      />
    </>
  );
}
