import { useMutation } from "@tanstack/react-query";
import { VerifyOTP_ForgetPassword } from "../api/authAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useVerifyOTP_ForgetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: VerifyOTP_ForgetPassword,
    onSuccess: (data) => {
      toast.success("OTP Is Correct!", {
        closeOnClick: true,
        position: "top-center",
      });
      console.log(data);
      localStorage.setItem("token", data.data.tokenEntity.token);
      navigate("../UpdatePassword");
    },
    onError: (data) => {
      toast.error("OTP Is Wrong ", {
        closeOnClick: true,
        position: "top-center",
      });
    },
  });
};
