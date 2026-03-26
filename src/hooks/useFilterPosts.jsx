import { useQuery } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";

export const useFilterPosts = (id, type) => {
  console.log(id);
  const { filterPosts, filterQuestion, myQuestions, myPosts } =
    useCommunityAPI();
  return useQuery({
    queryFn: () =>
      id === 3 && type === "Question"
        ? myQuestions()
        : id === 3 && type === "Artical"
          ? myPosts()
          : type === "Question"
            ? filterQuestion(id)
            : filterPosts(id),
    queryKey: [
      id === 3 && type === "Question"
        ? "myQuestions"
        : id === 3 && type === "Artical"
          ? "myArticals"
          : type === "Question"
            ? "filterQuestions"
            : "filteredPosts",
      id,
    ],
    enabled: id !== null,
  });
};
