import { useMutation } from "@tanstack/react-query";
import { VerifyOTP } from "../api/authAPI";
import { toast } from "react-toastify";

export const useVerifyOTP = () => {
  return useMutation({
    mutationFn: VerifyOTP,
    onSuccess: (data) => {
      toast.success("✅ OTP Is Correct!", {
        closeOnClick: true,
        position: "top-center",
      });
    },
    onError: (data) => {
      toast.error("❌ OTP Is Wrong ", {
        closeOnClick: true,
        position: "top-center",
      });
    },
  });
};
