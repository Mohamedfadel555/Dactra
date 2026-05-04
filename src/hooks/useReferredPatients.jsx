import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "./../api/sponsorshipAPI";

export const referralKeys = {
  all: ["referrals"],
  list: (params) => ["referrals", "list", params],
};

export function useReferredPatients(params = {}) {
  const { getProviderReferrals } = useSponsorshipAPI();

  return useQuery({
    queryKey: referralKeys.list(params),
    queryFn: () => getProviderReferrals(params),
    staleTime: 30_000,
    keepPreviousData: true,
  });
}

export function useReceiveReferral() {
  const { receiveReferral } = useSponsorshipAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (referralId) => receiveReferral(referralId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: referralKeys.all });
    },
  });
}
