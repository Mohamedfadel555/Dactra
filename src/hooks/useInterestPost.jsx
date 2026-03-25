import { useMutation } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const useInterestPost = () => {
  const { interestPost } = useCommunityAPI();
  return useMutation({
    mutationFn: interestPost,
    onError: () =>
      toast.error("something went wrong, try again later!", {
        position: "top-center",
        closeOnClick: true,
      }),
  });
};
