import { useMutation } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";

export const useBook = () => {
  const { Book } = useAppointmentAPI();
  return useMutation({
    mutationFn: Book,
    onSuccess: (res) => {
      console.log(res.data.appointmentId);
      window.open(res.data.appointmentId, "_blank");
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
