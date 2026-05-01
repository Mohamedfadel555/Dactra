// hooks/useBook.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";
import { useNotificationsApi } from "./useNotificationsApi";
import { toast } from "react-toastify";

export const useBook = (type, id) => {
  const { Book } = useAppointmentAPI();
  const { notifyBookAppointment } = useNotificationsApi();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: Book,
    onSuccess: (res, scheduleTableId) => {
      queryClient.invalidateQueries({ queryKey: ["online", id] });
      queryClient.invalidateQueries({ queryKey: ["inPerson", id] });

      notifyBookAppointment(scheduleTableId, {
        title: "Appointment",
        message: "Your appointment was booked.",
      })
        .then(() => {
          queryClient.invalidateQueries({ queryKey: ["notifications"] });
        })
        .catch(() => {});

      if (type === "cash") {
        toast.success("Appointment booked! Pay at the clinic.", {
          position: "top-center",
          closeOnClick: true,
        });
        return;
      }

      window.location.href = res.data.appointmentId;
    },
    onError: (err) => {
      console.log(err);
      toast.error("Failed to book appointment, try again later!", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
