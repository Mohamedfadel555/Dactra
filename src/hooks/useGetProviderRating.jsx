import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
export const useGetProviderRating = (providerId) => {
  const { fetchProviderRating } = useUserAPI();
  return useQuery({
    queryKey: ["providerRating", providerId],
    queryFn: () => fetchProviderRating(providerId),
    enabled: !!providerId,
    staleTime: 1000 * 60 * 2,
  });
};
