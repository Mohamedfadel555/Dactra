// useProviderAcceptCounter.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { toast } from "react-toastify";

export const useProviderAcceptCounter = () => {
  const { providerAcceptCounter } = useSponsorshipAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: providerAcceptCounter,
    onSuccess: () => {
      // قبول الكاونتر → الـ counter tab يتشيل، sponsored يتحدث
      queryClient.invalidateQueries({ queryKey: ["deals"] });
      queryClient.invalidateQueries({ queryKey: ["offers-summary"] });
      queryClient.invalidateQueries({ queryKey: ["sponsored"] });
    },
    onError: () =>
      toast.error("something went wrong, try again later", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
