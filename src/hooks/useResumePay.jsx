import { useMutation } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";

export const useResumePay = () => {
  const { resumePay } = useAppointmentAPI();
  return useMutation({
    mutationFn: resumePay,
    onSuccess: (data) => (window.location.href = data.url),
  });
};
