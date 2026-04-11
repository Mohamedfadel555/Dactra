import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const useDeleteComment = (id, type) => {
  const { deletePostComment, deleteQuestionComment } = useCommunityAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      type === "Question" ? deleteQuestionComment(id) : deletePostComment(id),
    onSuccess: () => {
      toast.success("deleted successfully", {
        position: "top-center",
        closeOnClick: true,
      });
      queryClient.invalidateQueries(["comments-infintie", id]);
      queryClient.invalidateQueries(["filteredQuestions", 2]);
    },
    onError: () =>
      toast.error("something went wrong", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
