import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";
export const useDeletePost = (type) => {
  console.log(type);
  const { deletePost, deleteQuestion } = useCommunityAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) =>
      type === "Question" ? deleteQuestion(id) : deletePost(id),
    onSuccess: () => {
      toast.success("deleted successfully", {
        position: "top-center",
        closeOnClick: true,
      });
      queryClient.invalidateQueries([
        type === "Question" ? "questions" : "posts",
      ]);
    },
    onError: () =>
      toast.error("something went wrong", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
