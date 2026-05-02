import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useTopRatedDoctors = (count = 10) => {
  const { getTopRatedDoctors } = useUserAPI();

  return useQuery({
    queryKey: ["topRatedDoctors", count],
    queryFn: () => getTopRatedDoctors(count),
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

