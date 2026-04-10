import { useInfiniteQuery, useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useGetCommentReplies = (id) => {
  const { getCommentReplies } = useCommunityAPI();
  return useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      getCommentReplies(id, { page: pageParam, pageSize: 5 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    queryKey: ["replies", id],
    enabled: id !== null,
    refetchOnWindowFocus: false,
  });
};
