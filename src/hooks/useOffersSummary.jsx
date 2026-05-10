// useOffersSummary.js
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

export const useOffersSummary = () => {
  const { offersSummary } = useSponsorshipAPI();
  const qc = useQueryClient();

  // السبب إن الـ summary بيتعمله invalidate من الـ mutations
  // بس لو الـ component مش mounted في وقت الـ mutation
  // (مثلاً لو الـ OurDeals page مش مفتوحة)
  // فمحتاجين نسمع الـ hub events هنا كمان للـ summary
  useHubEvent("OfferAccepted", () =>
    qc.invalidateQueries({ queryKey: ["offers-summary"] }),
  );
  useHubEvent("OfferRejected", () =>
    qc.invalidateQueries({ queryKey: ["offers-summary"] }),
  );
  useHubEvent("CounterOfferReceived", () =>
    qc.invalidateQueries({ queryKey: ["offers-summary"] }),
  );
  useHubEvent("SponsorshipCancelled", () =>
    qc.invalidateQueries({ queryKey: ["offers-summary"] }),
  );

  return useQuery({
    queryFn: offersSummary,
    queryKey: ["offers-summary"],
  });
};
