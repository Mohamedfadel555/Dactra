import { useMutation } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { toast } from "react-toastify";

export const useProviderRejectCounter = () => {
  const { providerRejectCounter } = useSponsorshipAPI();
  return useMutation({
    mutationFn: providerRejectCounter,
    onError: () =>
      toast.error("something went wrong, try again later", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
