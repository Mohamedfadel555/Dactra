import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
export const useRateProvider = (providerId) => {
  const queryClient = useQueryClient();
  const { rateProvider } = useUserAPI();
  return useMutation({
    mutationFn: (payload) => rateProvider({ providerId, payload }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["providerRating", providerId],
      });
    },
  });
};
