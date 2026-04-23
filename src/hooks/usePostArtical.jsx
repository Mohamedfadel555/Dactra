import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";
import { useNotificationsApi } from "./useNotificationsApi";

export const usePostArtical = (type) => {
  const { postArtical, PostQuestion } = useCommunityAPI();
  const { notifyMe } = useNotificationsApi();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: type === "Question" ? PostQuestion : postArtical,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: [type === "Question" ? "questions" : "posts"],
      });
      toast.success(
        type === "Question"
          ? "Question Posted successfully"
          : "Artical Posted successfully",
        {
          position: "top-center",
          closeOnClick: true,
        },
      );
      const msg =
        type === "Question"
          ? "Your question was published."
          : "Your article was published.";
      notifyMe(msg)
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        })
        .catch(() => {});
    },
    onError: () =>
      toast.error("Something went wrong, try again later!", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
