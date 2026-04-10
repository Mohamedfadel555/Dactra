import { useInfiniteQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
export function useGetPostsByTag(tagId, type = "Question") {
  const { getQuestionsByTag, getPostsByTag } = useCommunityAPI();
  return useInfiniteQuery({
    queryKey: ["posts-by-tag", tagId, type],
    queryFn: ({ pageParam }) =>
      type === "Question"
        ? getQuestionsByTag(tagId, { Page: pageParam, pageSize: 10 })
        : getPostsByTag(tagId, { Page: pageParam, pageSize: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: !!tagId,
  });
}
