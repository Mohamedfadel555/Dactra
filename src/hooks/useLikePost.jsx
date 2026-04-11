import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useLikePost = () => {
  const { likePost } = useCommunityAPI();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: likePost,
    onSuccess: () => {
      queryClient.invalidateQueries(["filteredPosts", 0]);
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
