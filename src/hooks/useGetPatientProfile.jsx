import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useGetPatientProfile = (id) => {
  const { getPatientProfile } = useUserAPI();
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => getPatientProfile(id),
    enabled: !!id,
  });
};
