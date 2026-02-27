import { useQuery } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";
import { useAuth } from "../Context/AuthContext";

export const useGetSlots = () => {
  const { getSlots } = useAppointmentAPI();
  const { role } = useAuth();
  return useQuery({
    queryFn: getSlots,
    queryKey: ["Slots"],
    retry: 2,
    enabled: role === "Doctor",
  });
};
