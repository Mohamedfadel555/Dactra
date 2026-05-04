import { useMutation } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { toast } from "react-toastify";

export const useSendReferral = () => {
  const { sendReferral } = useSponsorshipAPI();
  return useMutation({
    mutationFn: sendReferral,
    onSuccess: () =>
      toast.success("reffered successfully", {
        position: "top-center",
        closeOnClick: true,
      }),
    onError: () =>
      toast.error("Something went wrong ,try again later", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
