import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { toast } from "react-toastify";

export const useEditAllergies = () => {
  const { editAllergies } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editAllergies,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["myallergies"],
      });
      toast.success("Allergies updated successfully", {
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
