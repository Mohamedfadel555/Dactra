import { useQuery } from "@tanstack/react-query";
// import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useSponsorshipAPI } from "./../api/sponsorshipAPI";

export const useGetMySponsors = () => {
  const { mySponsorship } = useSponsorshipAPI();
  return useQuery({
    queryKey: ["mySponsors"],
    queryFn: mySponsorship,
  });
};
