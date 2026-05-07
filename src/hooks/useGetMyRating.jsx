import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useGetMyRating = (enable) => {
  const { getMyRating } = useUserAPI();
  return useQuery({
    queryKey: ["myrating"],
    queryFn: getMyRating,
    enabled: !enable,
  });
};
