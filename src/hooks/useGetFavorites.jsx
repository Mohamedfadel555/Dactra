import { useInfiniteQuery } from "@tanstack/react-query";
import { useUserAPI } from "./../api/userAPI";

export const useGetFavorites = (type) => {
  const { getFavorites } = useUserAPI();

  return useInfiniteQuery({
    queryKey: ["favorites", type],
    queryFn: ({ pageParam }) =>
      getFavorites({ type, page: pageParam, pageSize: 10 }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 2,
    enabled: !!type,
  });
};
