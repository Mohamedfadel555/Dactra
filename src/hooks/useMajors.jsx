import { useQuery } from "@tanstack/react-query";
import { getMajorsAPI } from "../api/authAPI";
import { toast } from "react-toastify";

export const useMajors = (userType) => {
  return useQuery({
    queryKey: ["Majors", userType],
    queryFn: getMajorsAPI,
    enabled: userType === "doctor",
    staleTime: 1000 * 60 * 60,
    retry: 2,
    select: (response) => {
      return response.data;
    },
    onError: () => {
      toast.error("Failed Loading Majors, Try again later", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
