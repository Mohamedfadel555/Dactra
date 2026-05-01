import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";
import { toast } from "react-toastify";

export const useCancelAppointment = () => {
  const { cancelAppointment } = useAppointmentAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelAppointment,
    onSuccess: () => {
      queryClient.invalidateQueries(["appointments", 0]);
      return toast.success("Cancelled successfully", {
        position: "top-center",
        closeOnClick: true,
      });
    },

    onError: () =>
      toast.error("something went wrong ,try again later", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
