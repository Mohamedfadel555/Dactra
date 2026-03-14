import { useMutation } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useLikePost = () => {
  const { likePost } = useCommunityAPI();
  return useMutation({
    mutationFn: likePost,
    onError: (err) => {
      console.log(err);
    },
  });
};
