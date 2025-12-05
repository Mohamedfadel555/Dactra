import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { useAuth } from "../Context/AuthContext";

export const useGetUser = () => {
  const { getMePatient, getMeDoctor } = useUserAPI();
  const { accessToken, role } = useAuth();
  return useQuery({
    queryKey: ["user"],
    queryFn: role === "Patient" ? getMePatient : getMeDoctor,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 10,
    refetchOnMount: false,
    refetchOnWindowFocus: false,
    throwOnError: (err) => {
      console.log(err);
    },
  });
};
