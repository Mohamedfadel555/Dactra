import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { toast } from "react-toastify";

export const useFavourite = (type) => {
  const { favourite } = useUserAPI();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: favourite,
    onSuccess: () => qc.invalidateQueries({ queryKey: ["favorites", type] }),
    onError: (err) => {
      console.log(err);
      if (err.status === 401)
        toast.error("you must login first", {
          position: "top-center",
          closeOnClick: true,
        });
      else {
        toast.error("something went wrong ,try again later", {
          position: "top-center",
          closeOnClick: true,
        });
      }
    },
  });
};
