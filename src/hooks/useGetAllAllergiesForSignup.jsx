import { useQuery } from "@tanstack/react-query";
import { useGeneralAPI } from "../api/generalAPI";

export const useGetAllAllergiesForSignup = () => {
  const { getAllAllergies } = useGeneralAPI();
  return useQuery({
    queryFn: getAllAllergies,
    queryKey: ["allallergies-signup"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 60 * 24 * 10,
  });
};

