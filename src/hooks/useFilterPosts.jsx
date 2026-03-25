import { useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useFilterPosts = (id, type) => {
  console.log(id);
  const { filterPosts, filterQuestion } = useCommunityAPI();
  return useQuery({
    queryFn: () => (type === "Question" ? filterQuestion(id) : filterPosts(id)),
    queryKey: [type === "Question" ? "filterQuestions" : "filteredPosts", id],
    enabled: id !== null,
  });
};
