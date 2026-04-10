import { useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useGetTrendingTags = (type) => {
  const { getQuestionsTrendingTags, getPostsTrendingTags } = useCommunityAPI();
  return useQuery({
    queryKey: ["trending", type],
    queryFn:
      type === "Question" ? getQuestionsTrendingTags : getPostsTrendingTags,
  });
};
