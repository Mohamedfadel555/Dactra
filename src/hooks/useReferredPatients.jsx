import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useHubEvent } from "./useHubEvent";

export const referralKeys = {
  all: ["referrals"],
  list: (params) => ["referrals", "list", params],
};

/**
 * Fetches referred patients for the provider.
 *
 * Real-time: no dedicated referral events exist on the hub yet,
 * but SponsorshipCancelled can affect referral context so we refresh.
 *
 * @param {object} params - pagination / filter params
 */
export function useReferredPatients(params = {}) {
  const { getProviderReferrals } = useSponsorshipAPI();
  const qc = useQueryClient();

  const query = useQuery({
    queryKey: referralKeys.list(params),
    queryFn: () => getProviderReferrals(params),
    staleTime: 30_000,
    placeholderData: (prev) => prev, // replaces deprecated keepPreviousData
  });

  // If a sponsorship is cancelled, the referral list context can change
  useHubEvent("SponsorshipCancelled", () => {
    qc.invalidateQueries({ queryKey: referralKeys.all });
  });

  return query;
}

/**
 * Marks a referral as received by the provider.
 */
export function useReceiveReferral() {
  const { receiveReferral } = useSponsorshipAPI();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (referralId) => receiveReferral(referralId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: referralKeys.all });
    },
  });
}
