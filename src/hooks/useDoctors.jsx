import { useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useAxios } from "../hooks/useAxios";

// Hook to fetch list of doctors using Search API.
// Supports pagination, filtering, and search.
export const useDoctors = (
  pageNumber = null,
  pageSize = null,
  searchTerm = "",
  specializationId = null,
  gender = null,
  sortedByRating = null
) => {
  const axiosInstance = useAxios();

  const fetchDoctors = async () => {
    const params = {};
    
    // Add pagination params if provided
    if (pageNumber !== null && pageSize !== null) {
      params.PageNumber = pageNumber;
      params.PageSize = pageSize;
    }

    // Add search and filter params
    if (searchTerm) {
      params.SearchTerm = searchTerm;
    }
    if (specializationId !== null) {
      params.SpecializationId = specializationId;
    }
    if (gender !== null) {
      params.Gender = gender;
    }
    if (sortedByRating !== null) {
      params.SortedByRating = sortedByRating;
    }

    const res = await axiosInstance.get("Doctor/Search", { params });
    return res.data;
  };

  // Include all params in queryKey so React Query refetches when they change
  const queryKey = ["doctors", "search", pageNumber, pageSize, searchTerm, specializationId, gender, sortedByRating];

  return useQuery({
    queryKey,
    queryFn: fetchDoctors,
    staleTime: 1000 * 60 * 5,
    retry: 2,
    onError: () => {
      toast.error("Failed loading doctors list, please try again later", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};


