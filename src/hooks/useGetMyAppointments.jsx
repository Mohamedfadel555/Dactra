import { useQuery } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";

export const useGetMyAppointments = ({ tab, page }) => {
  const { getMyAppointments } = useAppointmentAPI();
  return useQuery({
    queryKey: ["appointments", tab, page],
    queryFn: () => getMyAppointments({ tab, page }),
    keepPreviousData: true,
    staleTime: 15_000,
  });
};
