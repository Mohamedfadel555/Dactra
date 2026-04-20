import { useQuery } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";

export const useSiteReviews = () => {
  const { getSiteReviews, getSiteReviewsStats } = useUserAPI();

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
