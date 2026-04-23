import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";
import { useNotificationsApi } from "./useNotificationsApi";

export const useBook = () => {
  const { Book } = useAppointmentAPI();
  const { notifyBookAppointment } = useNotificationsApi();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: Book,
    onSuccess: (res, scheduleTableId) => {
      notifyBookAppointment(scheduleTableId, {
        title: "Appointment",
        message: "Your appointment was booked.",
      })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        })
        .catch(() => {});
      console.log(res.data.appointmentId);
      window.location.href = res.data.appointmentId;
    },
    onError: (err) => {
      console.log(err);
    },
  });
};
