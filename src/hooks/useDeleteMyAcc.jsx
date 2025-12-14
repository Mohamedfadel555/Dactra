import { useMutation } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { toast } from "react-toastify";

export const useDeleteMyAcc = () => {
  const { deleteMyAcc } = useUserAPI();
  return useMutation({
    mutationFn: deleteMyAcc,
    onSuccess: () => {
      toast.success("Account deleted successfully", {
        position: "top-center",
        closeOnClick: true,
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
