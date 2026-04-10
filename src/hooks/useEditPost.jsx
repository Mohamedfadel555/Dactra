import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const useEditPost = () => {
  const queryClient = useQueryClient();
  const { editPost } = useCommunityAPI();

  return useMutation({
    mutationFn: ({ id, content }) => editPost(id, { content }),
    onSuccess: () => {
      toast.success("edited successfully", {
        position: "top-center",
        closeOnClick: true,
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("something went wrong", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
