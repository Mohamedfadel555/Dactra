import { useMutation } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const useLikeComment = () => {
  const { likeComment } = useCommunityAPI();
  return useMutation({
    mutationFn: likeComment,
    onError: (err) =>
      toast.error("something went wrong try again later!", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
