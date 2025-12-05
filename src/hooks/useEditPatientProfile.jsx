import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { toast } from "react-toastify";

export const useEditPatientProfile = () => {
  const { editPatientProfile } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editPatientProfile,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["user"],
      });
      toast.success("Information Updated Successfully", {
        position: "top-center",
        closeOnClick: true,
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
