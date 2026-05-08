import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

export function useGetActiveSponsors() {
  const { getActiveSponsors } = useSponsorshipAPI();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: ["active-sponsors"],
    queryFn: getActiveSponsors,
    staleTime: 0,
    retry: 2,
    retryDelay: 500,
    throwOnError: false, // ← أضف ده
  });

  // ... باقي الكود زي ما هو

  console.log("QUERY DATA:", query.data); // ← أضف ده

  useHubEvent("OfferAccepted", async () => {
    await new Promise((res) => setTimeout(res, 300));
    qc.invalidateQueries({ queryKey: ["active-sponsors"] });
  });

  useHubEvent("CounterAccepted", async () => {
    await new Promise((res) => setTimeout(res, 300));
    qc.invalidateQueries({ queryKey: ["active-sponsors"] });
  });

  useHubEvent("SponsorshipCancelled", async () => {
    await new Promise((res) => setTimeout(res, 300));
    qc.invalidateQueries({ queryKey: ["active-sponsors"] });
    qc.invalidateQueries({ queryKey: ["doctor-offers"] });
  });

  return query;
}

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
