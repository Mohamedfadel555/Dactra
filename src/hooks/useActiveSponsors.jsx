import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";

/** Fetches active sponsors overview */
export const useGetActiveSponsors = () => {
  const { getActiveSponsors } = useSponsorshipAPI();

  return useQuery({
    queryKey: ["active-sponsors"],
    queryFn: getActiveSponsors,
    staleTime: 1000 * 60 * 2,
  });
};

/** Mutation to remove a sponsor */
export const useRemoveSponsor = () => {
  const qc = useQueryClient();
  const { removeSponsor } = useSponsorshipAPI();

  return useMutation({
    mutationFn: (id) => removeSponsor(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["active-sponsors"] });
    },
  });
};
