import { useQuery } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";

// const HUB_URL = "https://dactra.runasp.net/doctorScheduleHub";

export const useGetAppointmentsStat = () => {
  const { getAppointmentStat } = useAppointmentAPI();

  return useQuery({
    queryKey: ["appointment-statistics"],
    queryFn: () => getAppointmentStat(),
    keepPreviousData: true, // smooth pagination
    staleTime: 30_000,
  });
};
