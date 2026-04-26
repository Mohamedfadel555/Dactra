// hooks/useSaveSlots.js
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAppointmentAPI } from "../api/appointmentAPI";

export const useSaveSlots = (type) => {
  const { saveInPersonSlots, saveOnlineSlots } = useAppointmentAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (slots) =>
      type === "in-person" ? saveInPersonSlots(slots) : saveOnlineSlots(slots),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [type === "in-person" ? "inPersonSlots" : "onlineSlots"],
      });
      toast.success("Slots saved successfully!", {
        position: "top-center",
        closeOnClick: true,
      });
    },

    onError: () =>
      toast.error("Failed to save slots, try again later!", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
