import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCommunityAPI } from "../api/CommunityAPI";
import { toast } from "react-toastify";

export const usePostAnswer = (id) => {
  const { postAnswer } = useCommunityAPI();

  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, Data }) => postAnswer(id, Data),
    onSuccess: (sss) => {
      console.log(sss);
      toast.success("answer sent successfully", {
        position: "top-center",
        closeOnClick: true,
      });
      queryClient.refetchQueries(["comment", id]);
    },
    onError: (err) => {
      console.log(err);
      toast.error("something went wrong try again later", {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
