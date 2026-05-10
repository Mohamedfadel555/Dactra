import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

/**
 * Maps UI tab key → API status integer
 * received → 0 | rejected → 1 | counter → 2
 */
export const TAB_STATUS = {
  received: 0,
  rejected: 1,
  counter: 2,
};

/**
 * Fetches doctor offers filtered by status.
 * GET /api/Sponsorship/doctor/offers/by-status/{status}
 *
 * Real-time events handled:
 *  - OfferReceived      → invalidates "received" tab
 *  - CounterAccepted    → invalidates current tab
 *  - CounterRejected    → invalidates current tab
 *  - SponsorshipCancelled → invalidates all tabs
 *
 * @param {"received"|"rejected"|"counter"} tab
 * @param {{ page?: number, pageSize?: number }} params
 */
export function useGetDoctorOffersByStatus(tab, params) {
  const { getDoctorOffersByStatus } = useSponsorshipAPI();
  const qc = useQueryClient();
  const status = TAB_STATUS[tab];

  const query = useQuery({
    queryKey: ["doctor-offers", tab, params],
    queryFn: () => getDoctorOffersByStatus(status, params),
    staleTime: 1000 * 60 * 2,
    enabled: status !== undefined,
  });

  // A new offer arrived → refresh "received" tab
  useHubEvent("OfferReceived", () => {
    qc.invalidateQueries({ queryKey: ["doctor-offers", "received"] });
  });

  // Provider accepted our counter → refresh "counter" tab
  useHubEvent("CounterAccepted", () => {
    qc.invalidateQueries({ queryKey: ["doctor-offers", "counter"] });
    // Also refresh active sponsorships since a new one is now active
    qc.invalidateQueries({ queryKey: ["active-sponsors"] });
    qc.invalidateQueries({ queryKey: ["doctor-active-sponsorships"] });
  });

  // Provider rejected our counter → refresh "counter" + "rejected" tabs
  useHubEvent("CounterRejected", () => {
    qc.invalidateQueries({ queryKey: ["doctor-offers", "counter"] });
    qc.invalidateQueries({ queryKey: ["doctor-offers", "rejected"] });
  });

  // Either side cancelled → refresh everything
  useHubEvent("SponsorshipCancelled", () => {
    qc.invalidateQueries({ queryKey: ["doctor-offers"] });
    qc.invalidateQueries({ queryKey: ["active-sponsors"] });
    qc.invalidateQueries({ queryKey: ["doctor-active-sponsorships"] });
  });

  return query;
}
