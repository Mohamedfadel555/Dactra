import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useGetMyRatings = () => {
  const { getMyRatings } = useUserAPI();
  return useQuery({
    queryKey: ["ratings"],
    queryFn: getMyRatings,
  });
};
