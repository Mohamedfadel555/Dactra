import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { useAuth } from "../Context/AuthContext";

export const useGetMyRatings = () => {
  const { getMyRatings } = useUserAPI();
  const { role } = useAuth();
  return useQuery({
    queryKey: ["ratings"],
    queryFn: getMyRatings,
    enabled: role === "Doctor",
  });
};
