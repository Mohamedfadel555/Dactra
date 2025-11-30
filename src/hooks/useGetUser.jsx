import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { useAuth } from "../Context/AuthContext";

export const useGetUser = () => {
  const { getMe } = useUserAPI();
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["user"],
    queryFn: getMe,
    enabled: !!accessToken,
    staleTime: 1000 * 60,
  });
};
