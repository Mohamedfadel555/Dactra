import { useMutation } from "@tanstack/react-query";
import { LogoutAPI } from "../api/authAPI";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

export const useLogout = () => {
  const { logout } = useAuth();
  return useMutation({
    mutationFn: LogoutAPI,
    onSuccess: () => {
      toast.success("Logged Out Sucsessfully!", {
        position: "top-center",
        closeOnClick: true,
      });
      logout();
    },
    onError: () => {
      toast.error("Something went wrong", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
