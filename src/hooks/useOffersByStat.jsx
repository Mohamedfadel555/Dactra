import { useInfiniteQuery } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";

export const useOffersByStat = (id) => {
  const { offersBYStat } = useSponsorshipAPI();
  return useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      offersBYStat(id, { page: pageParam, pageSize: 10 }),
    queryKey: ["deals", id],
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: id !== null && id !== undefined,
  });
};
