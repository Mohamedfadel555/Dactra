import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const useEditComment = (id, type) => {
  const queryClient = useQueryClient();
  const { editComment } = useCommunityAPI();

  return useMutation({
    mutationFn: ({ commentId, content }) => editComment(commentId, { content }),
    onSuccess: () => {
      toast.success("edited successfully", {
        position: "top-center",
        closeOnClick: true,
      });
      type === "reply"
        ? queryClient.invalidateQueries({ queryKey: ["replies", id] })
        : queryClient.invalidateQueries({
            queryKey: ["comments-infinite", id],
          });
    },
    onError: (err) => {
      toast.error("something went wrong", {
        position: "top-center",
        closeOnClick: true,
      });
      console.log(err);
    },
  });
};
