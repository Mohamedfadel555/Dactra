import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useGetDoctorProfile = (id) => {
  const { getDoctorProfile } = useUserAPI();
  return useQuery({
    queryKey: ["profile", id],
    queryFn: () => getDoctorProfile(id),
    enabled: !!id,
  });
};
