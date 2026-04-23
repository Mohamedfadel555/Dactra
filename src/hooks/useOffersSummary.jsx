import { useQuery } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
export const useOffersSummary = () => {
  const { offersSummary } = useSponsorshipAPI();
  return useQuery({
    queryFn: offersSummary,
    queryKey: ["offers-summary"],
  });
};
