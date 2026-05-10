// useSponsoredDoctors.js
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

export function useSponsoredDoctors() {
  const { sponsoredDoctors } = useSponsorshipAPI();
  const qc = useQueryClient();

  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      sponsoredDoctors({ page: pageParam, pageSize: 10 }),
    queryKey: ["sponsored"],
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
  });

  // هنا بس بنعمل invalidate على sponsored لأن deals و summary
  // بيتعملهم invalidate من useOffersByStat
  useHubEvent("OfferAccepted", () => {
    qc.invalidateQueries({ queryKey: ["sponsored"] });
  });

  useHubEvent("SponsorshipCancelled", () => {
    qc.invalidateQueries({ queryKey: ["sponsored"] });
  });

  return query;
}
