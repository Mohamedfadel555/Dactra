// useGetDoctorOffersSummary.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

/** Fetches { receivedCount, counterCount, rejectedCount } */
export const useGetDoctorOffersSummary = () => {
  const { getDoctorOffersSummary } = useSponsorshipAPI();
  const qc = useQueryClient();

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["doctor-offers-summary"] });

  useHubEvent("OfferReceived", invalidate);
  useHubEvent("CounterAccepted", invalidate);
  useHubEvent("CounterRejected", invalidate);
  useHubEvent("SponsorshipCancelled", invalidate);

  return useQuery({
    queryKey: ["doctor-offers-summary"],
    queryFn: getDoctorOffersSummary,
    staleTime: 1000 * 60 * 2,
  });
};
