import { useMutation } from "@tanstack/react-query";
import { useGeneralAPI } from "../api/generalAPI";

export const useSendReviews = () => {
  const { sendReview } = useGeneralAPI();
  return useMutation({
    mutationFn: sendReview,
  });
};
