import { useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
export const useGetPosts = (type) => {
  const { getPosts, getQuestions } = useCommunityAPI();
  return useQuery({
    queryFn: type === "Question" ? getQuestions : getPosts,
    queryKey: [type === "Question" ? "questions" : "posts"],
  });
};
