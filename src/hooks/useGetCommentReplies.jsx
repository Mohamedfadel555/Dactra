import { useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useGetCommentReplies = (id) => {
  const { getCommentReplies } = useCommunityAPI();
  return useQuery({
    queryFn: () => getCommentReplies(id),
    queryKey: ["replies", id],
    enabled: id !== null,
  });
};
