import { useInfiniteQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
export const useGetPosts = (type) => {
  const { getPosts, getQuestions } = useCommunityAPI();
  return useInfiniteQuery({
    queryFn: ({ pageParam = 1 }) =>
      type === "Question"
        ? getQuestions({ page: pageParam, pageSize: 10 })
        : getPosts({ page: pageParam, size: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage?.posts?.hasNextPage || lastPage?.questions?.hasNextPage
        ? lastPage?.posts?.page + 1 || lastPage?.questions?.page + 1
        : undefined,

    refetchOnWindowFocus: false,
    queryKey: [type === "Question" ? "questions" : "posts"],
  });
};
