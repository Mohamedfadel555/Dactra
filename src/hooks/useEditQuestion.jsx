import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const useEditQuestion = () => {
  const queryClient = useQueryClient();
  const { editQuestion } = useCommunityAPI();

  return useMutation({
    mutationFn: ({ id, content }) => editQuestion(id, { content }),
    onSuccess: () => {
      toast.success("edited successfully", {
        position: "top-center",
        closeOnClick: true,
      });
      queryClient.invalidateQueries({ queryKey: ["questions"] });
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
