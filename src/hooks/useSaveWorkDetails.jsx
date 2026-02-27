import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppointmentAPI } from "../api/appointmentAPI";
import { toast } from "react-toastify";

export const useSaveWorkDetails = () => {
  const { saveWorkDetails } = useAppointmentAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: saveWorkDetails,
    onSuccess: () => {
      queryClient.refetchQueries({
        queryKey: ["workDetails"],
      });
      toast.success("Work Details Saved!", {
        position: "top-center",
        closeOnClick: true,
      });
    },
    onError: (error) => {
      toast.error("Something went wrong try again later ", {
        position: "top-center",
        closeOnClick: true,
      });
      console.log(error);
    },
  });
};
