// src/hooks/useGetCarePatients.js
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";
import { useDebounce } from "./useDebounce";

export const useGetCarePatients = (searchTerm = "") => {
  const { getCarePatients } = useSponsorshipAPI();
  const debouncedSearch = useDebounce(searchTerm, 500);

  const query = useInfiniteQuery({
    queryKey: ["care-patients", debouncedSearch],
    queryFn: ({ pageParam }) =>
      getCarePatients({
        page: pageParam,
        pageSize: 10,
        searchTerm: debouncedSearch || undefined,
      }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.hasNextPage ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 2,
  });

  return {
    ...query,
    isDebouncing: searchTerm !== debouncedSearch,
  };
};
