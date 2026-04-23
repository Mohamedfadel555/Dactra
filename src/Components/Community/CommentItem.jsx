import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useLikeComment } from "../../hooks/useLikeComment";
import { usePostAnswer } from "../../hooks/usePostAnswer";
import { useGetCommentReplies } from "../../hooks/useGetCommentReplies";
import { AnimatePresence, motion } from "framer-motion";
import AvatarIcon from "../Common/AvatarIcon1";
import AnswererInfo from "./AnswerInfo";
import {
  FiChevronDown,
  FiChevronUp,
  FiCornerDownRight,
  FiHeart,
  FiMoreHorizontal,
  FiSend,
} from "react-icons/fi";
import PostMenu from "./PostMenu";
import { ImHeart } from "react-icons/im";
import Spinner from "./Spinner";
import ReplyItem from "./ReplyItem";
import { useDeleteComment } from "../../hooks/useDeleteComment";
import { useEditComment } from "../../hooks/useEditComment";
import EditModal from "./EditModal";
import ReportModal from "../Common/ReportModal";
import { toast } from "react-toastify";
import {
  REPORT_TYPE,
  buildReportContent,
} from "../../utils/reportConstants";
import { useReportApi } from "../../hooks/useReportApi";
import { useNotificationsApi } from "../../hooks/useNotificationsApi";

export default function CommentItem({ comment, idx, type }) {
  const [showReplies, setShowReplies] = useState(false);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [visibleRepliesCount, setVisibleRepliesCount] = useState(5);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [reportOpen, setReportOpen] = useState(false);
  const [reportSubmitting, setReportSubmitting] = useState(false);
  const [displayContent, setDisplayContent] = useState(comment.content ?? "");
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const [optimisticLiked, setOptimisticLiked] = useState(
    comment.isLikedByCurrentUser,
  );
  const [optimisticCount, setOptimisticCount] = useState(comment.likesCount);

  const { accessToken } = useAuth();
  const { createReport } = useReportApi();
  const { notifySentToDoctor } = useNotificationsApi();
  const userEmail = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1])).email
    : null;
  const isOwner = comment?.email === userEmail;

  const likeMutation = useLikeComment();
  const answerMutation = usePostAnswer();
  const deleteCommentMutation = useDeleteComment(comment.questionId, type);
  const editCommentMutation = useEditComment(comment.questionId, "comment");

  const {
    data: repliesData,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading: repliesLoading,
  } = useGetCommentReplies(showReplies ? comment.id : null);

  const replies = useMemo(() => {
    if (!repliesData?.pages) return [];
    return repliesData.pages.flatMap((page) => page.items ?? []);
  });

  useEffect(() => {
    setVisibleRepliesCount(replies.length);
  }, [replies]);

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

  const notifyDoctorOnComment = () => {
    if (type !== "Artical" || isOwner) return;
    notifySentToDoctor(comment.questionId, {
      title: "New comment",
      message: "Someone commented on your article.",
    })
      .then(() => {
        queryClient.invalidateQueries({ queryKey: ["notifications"] });
      })
      .catch(() => {});
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
          notifyDoctorOnComment();
        },
      },
    );
  };

  const hasReplies = comment.repliesCount > 0 || replies?.length > 0;

  const handleDelete = () => {
    deleteCommentMutation.mutate(idx);
  };

  const handleEditSave = (newContent) => {
    editCommentMutation.mutate(
      {
        commentId: comment.id,
        content: newContent,
      },
      {
        onSuccess: () => {
          setDisplayContent(newContent);
          setEditOpen(false);
        },
      },
    );
  };

  const handleSubmitReport = async ({ reason, details }) => {
    setReportSubmitting(true);
    try {
      const text = buildReportContent(
        (details || "").trim(),
        {
          questionId: comment.questionId,
          threadType: type === "Artical" ? "Artical" : "Question",
        },
      );
      await createReport({
        type: REPORT_TYPE.COMMENT,
        title: reason,
        content: text,
        relatedEntityId: comment.id,
      });
      setReportOpen(false);
      toast.success("Report submitted.", { position: "top-center" });
    } catch {
      toast.error("Could not submit report.", { position: "top-center" });
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <>
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
                      <PostMenu
                        isOwner={isOwner}
                        onEdit={() => {
                          setMenuOpen(false);
                          setEditOpen(true);
                        }}
                        onDelete={handleDelete}
                        onReport={() => setReportOpen(true)}
                        onClose={() => setMenuOpen(false)}
                      />
                    )}
                  </AnimatePresence>
                </div>
              </div>
              <p className="text-[13.5px] text-slate-500 leading-relaxed">
                {displayContent}
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
                {optimisticLiked ? (
                  <ImHeart size={12} />
                ) : (
                  <FiHeart size={12} />
                )}
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

              {(comment.repliesCount > 0 || replies?.length > 0) && (
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
                      {replies.map((r) => (
                        <ReplyItem
                          key={r.id}
                          reply={r}
                          idx={r.id}
                          questionId={comment.questionId}
                          depth={0}
                          type={type}
                          onLike={(rid) => likeMutation.mutate(rid)}
                        />
                      ))}
                      {hasNextPage && (
                        <motion.button
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          whileTap={{ scale: 0.97 }}
                          onClick={() => fetchNextPage()}
                          className="mt-3 ml-2 flex items-center gap-1.5 text-[12px] font-semibold text-blue-500 hover:text-blue-600 border-none bg-transparent cursor-pointer"
                        >
                          <FiChevronDown size={13} />
                          {repliesData?.pages[0].totalCount -
                            visibleRepliesCount}{" "}
                          more{" "}
                          {repliesData?.pages[0].totalCount -
                            visibleRepliesCount ===
                          1
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

      {/* Edit Modal */}
      <EditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialText={displayContent}
        onSave={handleEditSave}
        isPending={editCommentMutation.isPending}
        title="Edit Comment"
      />
      <ReportModal
        isOpen={reportOpen}
        onClose={() => setReportOpen(false)}
        onSubmit={handleSubmitReport}
        isSubmitting={reportSubmitting}
        contentLabel="comment"
      />
    </>
  );
}
