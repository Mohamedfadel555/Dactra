import { useQuery } from "@tanstack/react-query";
import { useGeneralAPI } from "../api/generalAPI";

export const useGetAllChronicForSignup = () => {
  const { getAllChronic } = useGeneralAPI();
  return useQuery({
    queryFn: getAllChronic,
    queryKey: ["allchronic-signup"],
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 60 * 24 * 10,
  });
};

