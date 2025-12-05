import { useQuery } from "@tanstack/react-query";
import { useGeneralAPI } from "../api/generalAPI";

export const useCities = () => {
  const { getCities } = useGeneralAPI();
  return useQuery({
    queryKey: ["cities"],
    queryFn: getCities,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 60 * 24 * 30,
  });
};
