import { useMutation } from "@tanstack/react-query";
import { ResetPassword } from "../api/authAPI";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const useResetPassword = () => {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ResetPassword,
    onSuccess: (data) => {
      toast.success("Password Updated Successfully", {
        closeOnClick: true,
        position: "top-center",
      });
      navigate("../Login");
    },
    onError: (data) => {
      toast.error("Something went wrong,try again later", {
        closeOnClick: true,
        position: "top-center",
      });
    },
  });
};
