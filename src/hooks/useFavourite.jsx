import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { toast } from "react-toastify";

export const useFavourite = (type) => {
  const { favourite } = useUserAPI();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: favourite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites", type] }),
    onError: () =>
      toast.error("something went wrong ,try again later", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
