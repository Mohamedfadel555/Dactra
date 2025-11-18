import { useMutation } from "@tanstack/react-query";
import { SendOTP } from "../api/authAPI";
import { toast } from "react-toastify";

export const useSendOTP = () => {
  return useMutation({
    mutationFn: SendOTP,
    onSuccess: (data) => {
      toast.success("OTP Sent successfully!", {
        closeOnClick: true,
        position: "top-center",
      });
    },
    onError: (data) => {
      data.status === 404
        ? toast.error("User Isn't Found.", {
            closeOnClick: true,
            position: "top-center",
          })
        : toast.error("Something went wrong. Please try again later.", {
            closeOnClick: true,
            position: "top-center",
          });
    },
  });
};
