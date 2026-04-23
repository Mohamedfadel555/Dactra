import { useQuery } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";

export const useGetSlots = (role, type) => {
  const { getInPersonSlots, getOnlineSlots } = useAppointmentAPI();

  return useQuery({
    queryKey: [type === "in-person" ? "inPersonSlots" : "onlineSlots"],
    queryFn: type === "in-person" ? getInPersonSlots : getOnlineSlots,
    staleTime: 1000 * 60 * 5,
    enabled: role === "Doctor",
  });
};
