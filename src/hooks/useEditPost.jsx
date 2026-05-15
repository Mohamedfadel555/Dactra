import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const useEditPost = () => {
  const queryClient = useQueryClient();
  const { editPost } = useCommunityAPI();

  return useMutation({
    /**
     * @param {{ id: number, content: string, image?: File | null, removeImage?: boolean }} params
     */
    mutationFn: ({ id, content, image = null, removeImage = false }) => {
      const formData = new FormData();
      formData.append("Content", content);

      if (image) {
        // user picked a new image → attach it
        formData.append("Image", image);
      } else if (removeImage) {
        // user removed the existing image → send empty string to clear it
        formData.append("Image", "");
      }
      // if neither, don't append Image at all → server keeps the existing one

      return editPost(id, formData);
    },
    onSuccess: () => {
      toast.success("Edited successfully", {
        position: "top-center",
        closeOnClick: true,
      });
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
    onError: () => {
      toast.error("Something went wrong", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
