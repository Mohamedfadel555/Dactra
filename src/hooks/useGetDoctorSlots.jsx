import { useQuery } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";

export const useGetDoctorSlots = (id) => {
  const { getDoctorSlots } = useAppointmentAPI();
  return useQuery({
    queryKey: ["slotsToBook"],
    queryFn: () => getDoctorSlots(id),
  });
};
