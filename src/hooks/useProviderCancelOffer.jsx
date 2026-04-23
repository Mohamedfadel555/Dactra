import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { toast } from "react-toastify";

export const useProviderCancelOffer = () => {
  const { providerCancelOffer } = useSponsorshipAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: providerCancelOffer,
    onSuccess: () => queryClient.invalidateQueries(["deals", 0]),
    onError: () =>
      toast.error("something went wrong, try again later", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
