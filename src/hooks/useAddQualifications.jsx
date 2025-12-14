import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useAddQualifications = () => {
  const { addQualification } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addQualification,
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
