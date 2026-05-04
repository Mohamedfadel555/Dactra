import { useQuery } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";

/** Fetches { receivedCount, counterCount, rejectedCount } */
export const useGetDoctorOffersSummary = () => {
  const { getDoctorOffersSummary } = useSponsorshipAPI();

  return useQuery({
    queryKey: ["doctor-offers-summary"],
    queryFn: getDoctorOffersSummary,
    staleTime: 1000 * 60 * 2,
  });
};
