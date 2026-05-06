import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useGetWeeklyAppById = (id, role) => {
  const { getWeeklyAppById } = useUserAPI();
  return useQuery({
    queryKey: ["weekly-app", id],
    queryFn: () => getWeeklyAppById(id),
    enabled: role === "Doctor",
  });
};
