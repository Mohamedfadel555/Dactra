import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

/**
 * Fetches the doctor's active sponsors with stats.
 * GET /api/Sponsorship/doctor/active
 *
 * Real-time events handled:
 *  - CounterAccepted      → a counter offer was accepted, new sponsorship is active
 *  - SponsorshipCancelled → one of our active sponsors was cancelled
 */
export function useGetActiveSponsors() {
  const { getActiveSponsors } = useSponsorshipAPI();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["active-sponsors"],
    queryFn: getActiveSponsors,
    staleTime: 1000 * 60 * 2,
  });

  useHubEvent("CounterAccepted", () => {
    qc.invalidateQueries({ queryKey: ["active-sponsors"] });
  });

  useHubEvent("SponsorshipCancelled", () => {
    qc.invalidateQueries({ queryKey: ["active-sponsors"] });
    // Also refresh the offers list so status reflects the cancellation
    qc.invalidateQueries({ queryKey: ["doctor-offers"] });
  });

  return query;
}

/**
 * Cancels an active sponsorship (doctor side).
 * PUT /api/Sponsorship/doctor/cancel/{sponsorshipId}
 */
export function useRemoveSponsor() {
  const qc = useQueryClient();
  const { removeSponsor } = useSponsorshipAPI();

  return useMutation({
    mutationFn: (id) => removeSponsor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["active-sponsors"] });
      qc.invalidateQueries({ queryKey: ["doctor-offers"] });
    },
  });
}
