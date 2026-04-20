import { useInfiniteQuery } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";

export const useSponsoredDoctors = () => {
  const { sponsoredDoctors } = useSponsorshipAPI();
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      sponsoredDoctors({ page: pageParam, pageSize: 10 }),
    queryKey: ["sponsored"],
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  });
};
