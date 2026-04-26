import { useQuery } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";

export const useGetSlotsById = (type, id) => {
  const { getInpersonSlotsById, getOnlineSlotsById } = useAppointmentAPI();
  return useQuery({
    queryFn: () =>
      type === "online" ? getOnlineSlotsById(id) : getInpersonSlotsById(id),
    queryKey: [type, id],
  });
};
