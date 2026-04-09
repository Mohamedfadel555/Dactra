import { useInfiniteQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useGetQuestionsAnswersInfinite = (questionId) => {
  const { getQuestionsAnswers } = useCommunityAPI();
  return useInfiniteQuery({
    queryKey: ["comments-infinite", questionId],
    queryFn: ({ pageParam = 1 }) =>
      getQuestionsAnswers(questionId, { page: pageParam, pageSize: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: !!questionId,
    refetchOnWindowFocus: false,
  });
};
