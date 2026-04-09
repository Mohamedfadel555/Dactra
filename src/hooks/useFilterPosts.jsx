import { useInfiniteQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useFilterPosts = (id, type) => {
  const { filterPosts, filterQuestion, myQuestions, myPosts } =
    useCommunityAPI();

  return useInfiniteQuery({
    queryKey:
      id === 3 && type === "Question"
        ? ["myQuestions"]
        : id === 3 && type === "Artical"
          ? ["myArticals"]
          : type === "Question"
            ? ["filterQuestions", id]
            : ["filteredPosts", id],
    queryFn: ({ pageParam = 1 }) => {
      if (id === 3 && type === "Question")
        return myQuestions({ page: pageParam, pageSize: 10 });
      if (id === 3 && type === "Artical")
        return myPosts({ page: pageParam, pageSize: 10 });
      if (type === "Question")
        return filterQuestion({ page: pageParam, pageSize: 10, filter: id });
      return filterPosts({ page: pageParam, pageSize: 10, filter: id });
    },
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: id !== null,
    refetchOnWindowFocus: false,
  });
};
