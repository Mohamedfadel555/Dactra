import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";
import { toast } from "react-toastify";

export const useSaveAVSlots = () => {
  const { saveAVSlots } = useAppointmentAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: saveAVSlots,
    onSuccess: (s) => {
      console.log(s);
      queryClient.refetchQueries({
        queryKey: ["Slots"],
      });
      toast.success("Slots saved successfully!", {
        position: "top-center",
        closeOnClick: true,
      });
    },
    onError: (error) => {
      console.log(error);
      toast.error("failed to save slots", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
