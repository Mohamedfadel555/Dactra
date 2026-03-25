import { useMutation } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useSavePost = (type) => {
  const { savePost, saveQuestion } = useCommunityAPI();
  return useMutation({
    mutationFn: type === "Question" ? saveQuestion : savePost,
    onError: (err) => console.log(err),
  });
};
