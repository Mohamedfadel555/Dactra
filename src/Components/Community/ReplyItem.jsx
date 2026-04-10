import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../../Context/AuthContext";
import { useLikeComment } from "../../hooks/useLikeComment";
import { usePostAnswer } from "../../hooks/usePostAnswer";
import { useGetCommentReplies } from "../../hooks/useGetCommentReplies";
import { AnimatePresence, motion } from "framer-motion";
import AvatarIcon from "../Common/AvatarIcon1";
import AnswererInfo from "./AnswerInfo";
import PostMenu from "./PostMenu";
import { ImHeart } from "react-icons/im";
import {
  FiChevronDown,
  FiChevronUp,
  FiCornerDownRight,
  FiHeart,
  FiMoreHorizontal,
  FiSend,
} from "react-icons/fi";
import Spinner from "./Spinner";
import { useDeleteComment } from "../../hooks/useDeleteComment";
import { useEditComment } from "../../hooks/useEditComment";
import EditModal from "./EditModal";
// import EditModal from "./EditModal";

export default function ReplyItem({
  reply,
  idx,
  questionId,
  depth,
  onLike,
  type,
}) {
  const [optimisticLiked, setOptimisticLiked] = useState(
    reply.isLikedByCurrentUser,
  );
  const [optimisticCount, setOptimisticCount] = useState(reply.likesCount);
  const [replyOpen, setReplyOpen] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [showNested, setShowNested] = useState(false);
  const [visibleNested, setVisibleNested] = useState(5);
  const [menuOpen, setMenuOpen] = useState(false);
  const [editOpen, setEditOpen] = useState(false);
  const [displayContent, setDisplayContent] = useState(reply.content ?? "");
  const inputRef = useRef(null);
  const queryClient = useQueryClient();

  const { accessToken } = useAuth();
  const userEmail = accessToken
    ? JSON.parse(atob(accessToken.split(".")[1])).email
    : null;
  const isOwner = reply.email === userEmail;

  const likeMutation = useLikeComment();
  const answerMutation = usePostAnswer();
  const deleteReplyMutation = useDeleteComment(type);
  const editCommentMutation = useEditComment(reply.parentAnswerId, "reply");

  console.log(reply);

  const {
    data: nestedData,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
    isLoading: nestedLoading,
  } = useGetCommentReplies(showNested ? reply.id : null);

  const nestedReplies = useMemo(() => {
    if (!nestedData?.pages) return [];
    return nestedData.pages.flatMap((page) => page.items ?? []);
  });

  useEffect(() => {
    setVisibleNested(nestedReplies.length);
  }, [nestedReplies]);

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

  const handleDelete = () => {
    deleteReplyMutation.mutate(idx);
  };

  const handleEditSave = (newContent) => {
    editCommentMutation.mutate(
      {
        commentId: reply.id,
        content: newContent,
        questionId,
      },
      {
        onSuccess: () => {
          setDisplayContent(newContent);
          setEditOpen(false);
        },
      },
    );
  };

  const canNestFurther = depth < 2;
  const hasNestedReplies = reply.repliesCount > 0 || nestedReplies.length > 0;

  return (
    <>
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
                    <PostMenu
                      isOwner={isOwner}
                      onEdit={() => {
                        setMenuOpen(false);
                        setEditOpen(true);
                      }}
                      onDelete={handleDelete}
                      onReport={() => console.log("report reply", reply.id)}
                      onClose={() => setMenuOpen(false)}
                    />
                  )}
                </AnimatePresence>
              </div>
            </div>
            <p className="text-[12.5px] max-w-full text-wrap text-slate-500 leading-relaxed">
              {displayContent}
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
                        type={type}
                        onLike={onLike}
                      />
                    ))}
                    {hasNextPage && (
                      <button
                        onClick={() => fetchNextPage()}
                        className="mt-2 ml-1 text-[11px] font-semibold text-blue-400 hover:text-blue-600 border-none bg-transparent cursor-pointer flex items-center gap-1"
                      >
                        <FiChevronDown size={11} />
                        {nestedData.pages[0].totalCount -
                          visibleNested} more{" "}
                        {nestedData.pages[0].totalCount - visibleNested === 1
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

      {/* Edit Modal */}
      <EditModal
        isOpen={editOpen}
        onClose={() => setEditOpen(false)}
        initialText={displayContent}
        onSave={handleEditSave}
        isPending={editCommentMutation.isPending}
        title="Edit Reply"
      />
    </>
  );
}
