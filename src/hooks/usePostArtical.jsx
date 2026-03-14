import { useMutation } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const usePostArtical = () => {
  const { postArtical } = useCommunityAPI();
  return useMutation({
    mutationFn: postArtical,
    onSuccess: () =>
      toast.success("Artical Posted successfully", {
        position: "top-center",
        closeOnClick: true,
      }),
    onError: () =>
      toast.error("Something went wrong, try again later!", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
