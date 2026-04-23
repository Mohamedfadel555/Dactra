import { useMutation } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { toast } from "react-toastify";

export const useProviderAcceptCounter = () => {
  const { providerAcceptCounter } = useSponsorshipAPI();
  return useMutation({
    mutationFn: providerAcceptCounter,
    onError: () =>
      toast.error("something went wrong, try again later", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
