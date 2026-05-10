import { useQueries, useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useGetWeeklyApp = (role) => {
  const { getWeeklyApp } = useUserAPI();
  return useQuery({
    queryKey: ["weekly-app"],
    queryFn: getWeeklyApp,
    enabled: role === "Doctor",
  });
};
