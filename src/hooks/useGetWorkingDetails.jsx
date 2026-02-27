import { useQuery } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";
import { useAuth } from "../Context/AuthContext";

export const useGetWorkingDetails = () => {
  const { getWorkDetails } = useAppointmentAPI();
  const { role } = useAuth();
  return useQuery({
    queryFn: getWorkDetails,
    queryKey: ["workDetails"],
    enabled: role === "Doctor",
    refetchOnMount: false,
    refetchOnWindowFocus: false,

    retry: 2,
    staleTime: 1000 * 60 * 60 * 24 * 10,
  });
};
