import { useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
export const useGetPosts = () => {
  const { getPosts } = useCommunityAPI();
  return useQuery({
    queryFn: getPosts,
    queryKey: ["posts"],
  });
};
