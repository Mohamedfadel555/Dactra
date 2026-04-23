import { useMutation } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { toast } from "react-toastify";

export const useProviderCancelDeal = () => {
  const { providerCancelDeal } = useSponsorshipAPI();
  return useMutation({
    mutationFn: providerCancelDeal,
    onError: () =>
      toast.error("something went wrong ,try again later", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
