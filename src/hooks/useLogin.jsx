//import toast for notifications
import { toast } from "react-toastify";
//import the api
import { LoginAPI } from "../api/authAPI";

//import mutation of react query
import { useMutation } from "@tanstack/react-query";

let message = "";

//make the hook of login
export const useLogin = () => {
  return useMutation({
    //function of aoi
    mutationFn: LoginAPI,
    onSuccess: (data) => {
      console.log(data);
      toast.success("Logged in successfully!", {
        position: "top-center",
        closeOnClick: true,
      });
    },
    onError: (data) => {
      //specifie the error message from status
      data.status === 401
        ? (message = "Email or password is invalid!")
        : data.status === 400
        ? (message = "User Isn't Fonud")
        : (message = "Something went wrong. Please try again later.");
      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //not completed yet
      toast.error(message, {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
