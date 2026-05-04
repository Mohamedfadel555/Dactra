import { useQuery } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";

/**
 * Maps UI tab key → API status integer
 * received → 0 | rejected → 1 | counter → 2
 */
export const TAB_STATUS = {
  received: 0,
  rejected: 1,
  counter: 2,
};

/**
 * Fetches doctor offers filtered by status from:
 * GET /api/Sponsorship/doctor/offers/by-status/{status}
 *
 * @param {"received"|"rejected"|"counter"} tab
 * @param {{ page?: number, pageSize?: number }} params
 */
export const useGetDoctorOffersByStatus = (tab, params) => {
  const { getDoctorOffersByStatus } = useSponsorshipAPI();
  const status = TAB_STATUS[tab];

  return useQuery({
    queryKey: ["doctor-offers", tab, params],
    queryFn: () => getDoctorOffersByStatus(status, params),
    staleTime: 1000 * 60 * 2,
    enabled: status !== undefined,
  });
};
