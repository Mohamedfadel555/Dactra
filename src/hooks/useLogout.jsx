import { useMutation, useQueryClient } from "@tanstack/react-query";
import { LogoutAPI } from "../api/authAPI";
import { toast } from "react-toastify";
import { useAuth } from "../Context/AuthContext";

export const useLogout = () => {
  const { logout } = useAuth();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: LogoutAPI,
    onSuccess: () => {
      toast.success("Logged Out Sucsessfully!", {
        position: "top-center",
        closeOnClick: true,
      });
      queryClient.clear();
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
