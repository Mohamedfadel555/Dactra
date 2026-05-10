import { useInfiniteQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useGetQuestionsAnswersInfinite = (questionId) => {
  console.log(questionId);
  const { getQuestionsAnswers } = useCommunityAPI();
  return useInfiniteQuery({
    queryKey: ["comments-infinite", Number(questionId)],
    queryFn: ({ pageParam = 1 }) =>
      getQuestionsAnswers(questionId, { page: pageParam, pageSize: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: !!questionId,
    refetchOnWindowFocus: false,
    staleTime: Infinity, // ✅ خلي الـ cache يفضل fresh دايماً
  });
};
