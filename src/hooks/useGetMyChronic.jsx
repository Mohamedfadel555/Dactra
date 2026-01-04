import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { useAuth } from "../Context/AuthContext";

export const useGetMyChronic = () => {
  const { getMyChronic } = useUserAPI();
  const { role } = useAuth();
  return useQuery({
    queryKey: ["mychronic"],
    queryFn: getMyChronic,
    enabled: role === "Patient",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 60 * 24,
  });
};
