import { useMutation } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { toast } from "react-toastify";

export const useChangePassword = () => {
  const { changePasswordAPI } = useUserAPI();
  return useMutation({
    mutationFn: changePasswordAPI,
    onSuccess: () => {
      toast.success("Password Changed Successfully", {
        position: "top-center",
        closeOnClick: true,
      });
    },
    onError: (err) => {
      err.status === 400
        ? toast.error("Password is Wrong", {
            position: "top-center",
            closeOnClick: true,
          })
        : toast.error("something went wrong,try again later", {
            position: "top-center",
            closeOnClick: true,
          });
    },
  });
};
