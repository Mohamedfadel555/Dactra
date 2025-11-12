import { useMutation } from "@tanstack/react-query";
import { ReSendOTP } from "../api/authAPI";
import { toast } from "react-toastify";

let message = "";

export const useReSendOTP = () => {
  return useMutation({
    mutationFn: ReSendOTP,
    onSuccess: (data) => {
      toast.success("OTP Resent successfully!", {
        closeOnClick: true,
        position: "top-center",
      });
    },
    onError: (data) => {
      data.status === 500
        ? (message = "Something went wrong. Please try again later")
        : (message = "OTP Is Wrong");
      toast.error(message, {
        closeOnClick: true,
        position: "top-center",
      });
    },
  });
};
