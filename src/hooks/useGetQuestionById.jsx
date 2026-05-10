import { useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useGetQuestionById = (id) => {
  const { getQuestionById } = useCommunityAPI();
  return useQuery({
    queryKey: ["question", Number(id)],
    queryFn: () => getQuestionById(id),
  });
};
