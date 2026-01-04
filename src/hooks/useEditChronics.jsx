import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { toast } from "react-toastify";

export const useEditChronics = () => {
  const { editchronics } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editchronics,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["mychronic"],
      });
      toast.success("Chronics updated successfully", {
        position: "top-center",
        closeOnClick: true,
      });
    },
    onError: () => {
      toast.error("something went wrong, please try again later", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
