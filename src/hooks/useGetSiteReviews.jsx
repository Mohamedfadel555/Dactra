import { useQuery } from "@tanstack/react-query";
import { useGeneralAPI } from "../api/generalAPI";

export const useGetSiteReviews = () => {
  const { getSiteReviews } = useGeneralAPI();
  return useQuery({
    queryKey: ["sitereviews"],
    queryFn: getSiteReviews,
  });
};
