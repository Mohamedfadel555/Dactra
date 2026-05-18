import { useQuery } from "@tanstack/react-query";
import { useAxios } from "./useAxios";

export const useSearchDoctors = ({
  pageNumber = 1,
  pageSize = 9,
  specializationId,
  gender,
  searchTerm,
} = {}) => {
  const axiosInstance = useAxios();

  return useQuery({
    queryKey: [
      "sponsorship-doctors",
      pageNumber,
      pageSize,
      specializationId,
      gender,
      searchTerm,
    ],
    queryFn: async () => {
      const params = { PageNumber: pageNumber, PageSize: pageSize };
      if (specializationId != null) params.SpecializationId = specializationId;
      if (gender != null) params.Gender = gender;
      if (searchTerm) params.SearchTerm = searchTerm;

      const res = await axiosInstance.get(
        "Sponsorship/provider/doctors/search",
        { params },
      );
      return res.data;
    },
    staleTime: 1000 * 60 * 2,
    keepPreviousData: true,
  });
};
