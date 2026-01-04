import { useQuery } from "@tanstack/react-query";
import { useAuth } from "../Context/AuthContext";
import { useGeneralAPI } from "../api/generalAPI";

export const useGetAllAllergies = () => {
  const { getAllAllergies } = useGeneralAPI();
  const { role } = useAuth();
  return useQuery({
    queryFn: getAllAllergies,
    queryKey: ["allallergies"],
    enabled: role === "Patient",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 60 * 24 * 10,
  });
};
