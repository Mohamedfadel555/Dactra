// useProviderRejectCounter.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { toast } from "react-toastify";

export const useProviderRejectCounter = () => {
  const { providerRejectCounter } = useSponsorshipAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerRejectCounter,
    onSuccess: () => {
      // رفض الكاونتر → counter tab يتشيل، rejected يزيد
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["offers-summary"] });
    },
    onError: () =>
      toast.error("something went wrong, try again later", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
