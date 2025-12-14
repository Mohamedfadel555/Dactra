import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { use } from "react";
import { useAuth } from "../Context/AuthContext";

export const useGetMyQualifications = () => {
  const { getMyQualifications } = useUserAPI();
  const { role } = useAuth();
  return useQuery({
    queryKey: ["qualifications"],
    queryFn: getMyQualifications,
    enabled: role === "Doctor",
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000 * 60 * 60,
  });
};
