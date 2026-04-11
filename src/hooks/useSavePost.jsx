import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useSavePost = (type) => {
  const { savePost, saveQuestion } = useCommunityAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: type === "Question" ? saveQuestion : savePost,
    onSuccess: () => {
      queryClient.invalidateQueries([
        type === "Question" ? "filteredQuestions" : "filteredPosts",
        1,
      ]);
    },
    onError: (err) => console.log(err),
  });
};
