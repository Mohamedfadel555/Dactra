import { useMutation } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useSavePost = () => {
  const { savePost } = useCommunityAPI();
  return useMutation({
    mutationFn: savePost,
    onError: (err) => console.log(err),
  });
};
