import { useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useGetQuestions = () => {
  const { getQuestions } = useCommunityAPI();
  return useQuery({
    queryKey: ["questions"],
    queryFn: getQuestions,
  });
};
