import { useInfiniteQuery, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

/**
 * Infinite-paginated list of actively sponsored doctors (provider side).
 * GET /api/Sponsorship/provider/active-sponsors/overview
 *
 * Real-time events handled:
 *  - OfferAccepted        → new doctor became active
 *  - CounterOfferReceived → list state might change (counter pending)
 *  - SponsorshipCancelled → a doctor left the active list
 */
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

  useHubEvent("OfferAccepted", () => {
    qc.invalidateQueries({ queryKey: ["sponsored"] });
    qc.invalidateQueries({ queryKey: ["deals"] });
  });

  useHubEvent("CounterOfferReceived", () => {
    qc.invalidateQueries({ queryKey: ["deals"] });
  });

  useHubEvent("SponsorshipCancelled", () => {
    qc.invalidateQueries({ queryKey: ["sponsored"] });
    qc.invalidateQueries({ queryKey: ["deals"] });
  });

  return query;
}
