import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { toast } from "react-toastify";

export const useSiteReviews = () => {
  const { getSiteReviews } = useUserAPI();

  return useQuery({
    queryKey: ["siteReviews"],
    queryFn: getSiteReviews,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useSiteReviewsStats = () => {
  const { getSiteReviewsStats } = useUserAPI();

  return useQuery({
    queryKey: ["siteReviewsStats"],
    queryFn: getSiteReviewsStats,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useSiteReviewsDistribution = () => {
  const { getSiteReviewsDistribution } = useUserAPI();

  return useQuery({
    queryKey: ["siteReviewsDistribution"],
    queryFn: getSiteReviewsDistribution,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};

export const useCreateSiteReview = () => {
  const { createSiteReview } = useUserAPI();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createSiteReview,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["siteReviews"] });
      queryClient.invalidateQueries({ queryKey: ["siteReviewsStats"] });
      queryClient.invalidateQueries({ queryKey: ["siteReviewsDistribution"] });
      toast.success("Review submitted.", { position: "top-center" });
    },
    onError: (err) => {
      const data = err?.response?.data;
      const msg =
        data?.message ||
        data?.title ||
        "Could not submit review.";
      toast.error(msg, { position: "top-center" });
    },
  });
};
