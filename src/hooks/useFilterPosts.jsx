import { useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useFilterPosts = (id) => {
  console.log(id);
  const { filterPosts } = useCommunityAPI();
  return useQuery({
    queryFn: () => filterPosts(id),
    queryKey: ["filteredPosts", id],
    enabled: id !== null,
  });
};
