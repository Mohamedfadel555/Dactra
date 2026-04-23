import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const usePostArtical = (type) => {
  const { postArtical, PostQuestion } = useCommunityAPI();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: type === "Question" ? PostQuestion : postArtical,
    onSuccess: () => {
      queryClient.invalidateQueries([
        type === "Question" ? "questions" : "posts",
      ]);
      toast.success(
        type === "Question"
          ? "Question Posted successfully"
          : "Artical Posted successfully",
        {
          position: "top-center",
          closeOnClick: true,
        },
      );
    },
    onError: () =>
      toast.error("Something went wrong, try again later!", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
