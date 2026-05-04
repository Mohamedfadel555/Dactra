import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";

const OFFERS_KEY = ["doctor-offers"];
const SUMMARY_KEY = ["doctor-offers-summary"];

export const useDealMutations = () => {
  const qc = useQueryClient();
  const { acceptDeal, rejectDeal, counterDeal, cancelCounter } =
    useSponsorshipAPI();

  const invalidate = () => {
    qc.invalidateQueries({ queryKey: OFFERS_KEY });
    qc.invalidateQueries({ queryKey: SUMMARY_KEY });
  };

  const acceptMutation = useMutation({
    mutationFn: (id) => acceptDeal(id),
    onSuccess: invalidate,
  });

  const rejectMutation = useMutation({
    mutationFn: (id) => rejectDeal(id),
    onSuccess: invalidate,
  });

  const counterMutation = useMutation({
    mutationFn: ({ id, data }) => counterDeal(id, data),
    onSuccess: invalidate,
  });

  const cancelCounterMutation = useMutation({
    mutationFn: (id) => cancelCounter(id),
    onSuccess: invalidate,
  });

  return {
    acceptMutation,
    rejectMutation,
    counterMutation,
    cancelCounterMutation,
  };
};
