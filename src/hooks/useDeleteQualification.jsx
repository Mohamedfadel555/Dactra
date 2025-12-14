import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useDeleteQualification = () => {
  const { deleteQualification } = useUserAPI();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteQualification,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["qualifications"],
      });
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
