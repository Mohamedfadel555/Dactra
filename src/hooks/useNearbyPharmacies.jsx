import { useMutation } from "@tanstack/react-query";
import { usePerceptionAPI } from "./../api/perceptionAPI";

export const useNearbyPharmacies = () => {
  const { getNearbyPharmacies } = usePerceptionAPI();

  return useMutation({
    mutationFn: (params) => getNearbyPharmacies(params),
    onError: (error) => {
      console.error("Pharmacy search failed:", error);
    },
  });
};
