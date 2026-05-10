// useOffersByStat.js
import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

export function useOffersByStat(id) {
  const { offersBYStat } = useSponsorshipAPI();
  const qc = useQueryClient();

  const invalidateAll = () => {
    qc.invalidateQueries({ queryKey: ["deals"] });
    qc.invalidateQueries({ queryKey: ["offers-summary"] });
  };

  const invalidateWithSponsored = () => {
    invalidateAll();
    qc.invalidateQueries({ queryKey: ["sponsored"] });
  };

  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      offersBYStat(id, { page: pageParam, pageSize: 10 }),
    queryKey: ["deals", id],
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: id !== null && id !== undefined,
  });

  // Doctor accepted our offer → pending list shrinks, sponsored grows
  useHubEvent("OfferAccepted", invalidateWithSponsored);

  // Doctor rejected → pending → rejected tab
  useHubEvent("OfferRejected", invalidateAll);

  // Doctor sent counter → pending → counter tab
  useHubEvent("CounterOfferReceived", invalidateAll);

  // Either side cancelled active sponsorship
  useHubEvent("SponsorshipCancelled", invalidateWithSponsored);

  return query;
}
