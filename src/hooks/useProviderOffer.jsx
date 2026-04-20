import { useMutation } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { toast } from "react-toastify";

export const useProviderOffer = () => {
  const { providerOffer } = useSponsorshipAPI();
  return useMutation({
    mutationFn: providerOffer,

    onError: (err) => {
      err.status === 409
        ? toast.error("you already have deal with this doctor", {
            position: "top-center",
            closeOnClick: true,
          })
        : toast.error("something went wrong ,try again later", {
            position: "top-center",
            closeOnClick: true,
          });
    },
  });
};
