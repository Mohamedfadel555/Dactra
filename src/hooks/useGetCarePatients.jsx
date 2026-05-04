import { useQuery } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";

/** Fetches doctor's care patients list */
export const useGetCarePatients = () => {
  const { getCarePatients } = useSponsorshipAPI();

  return useQuery({
    queryKey: ["care-patients"],
    queryFn: getCarePatients,
    staleTime: 1000 * 60 * 2,
  });
};
