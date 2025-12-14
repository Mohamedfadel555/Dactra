import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { toast } from "react-toastify";

export const useAddVitals = () => {
  const { addVital } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addVital,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["vitals"],
      });
      toast.success("Added Successfully", {
        position: "top-center",
        closeOnClick: true,
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
