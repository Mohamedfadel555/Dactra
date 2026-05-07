import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

/**
 * Infinite-paginated list of offers for a given status filter (provider side).
 * GET /api/Sponsorship/provider/offers/by-status/{status}
 *
 * Real-time events handled:
 *  - OfferAccepted        → a doctor accepted our offer
 *  - OfferRejected        → a doctor rejected our offer
 *  - CounterOfferReceived → a doctor sent a counter offer
 *  - SponsorshipCancelled → an active sponsorship was cancelled
 *
 * @param {number} id  - OfferFilterStatus value (0=Pending, 1=Rejected, 2=Counter)
 */
export function useOffersByStat(id) {
  const { offersBYStat } = useSponsorshipAPI();
  const qc = useQueryClient();

  const query = useInfiniteQuery({
    queryFn: ({ pageParam }) =>
      offersBYStat(id, { page: pageParam, pageSize: 10 }),
    queryKey: ["deals", id],
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    enabled: id !== null && id !== undefined,
  });

  // Doctor accepted → pending list shrinks, active list grows
  useHubEvent("OfferAccepted", () => {
    qc.invalidateQueries({ queryKey: ["deals"] });
    qc.invalidateQueries({ queryKey: ["sponsored"] });
  });

  // Doctor rejected → pending → rejected
  useHubEvent("OfferRejected", () => {
    qc.invalidateQueries({ queryKey: ["deals"] });
  });

  // Doctor sent counter → pending → counter
  useHubEvent("CounterOfferReceived", () => {
    qc.invalidateQueries({ queryKey: ["deals"] });
  });

  // Either side cancelled active sponsorship
  useHubEvent("SponsorshipCancelled", () => {
    qc.invalidateQueries({ queryKey: ["deals"] });
    qc.invalidateQueries({ queryKey: ["sponsored"] });
  });

  return query;
}
