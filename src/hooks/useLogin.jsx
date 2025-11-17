//import toast for notifications
import { toast } from "react-toastify";
//import the api
import { LoginAPI } from "../api/authAPI";

//import mutation of react query
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSendOTP } from "./useSendOTP";

let message = "";

//make the hook of login
export const useLogin = () => {
  const navigate = useNavigate();
  const sendOTPMutation = useSendOTP();
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
    onError: async (data) => {
      //specifie the error message from status
      if (data.status === 401) {
        toast.error("Email or password is invalid!", {
          position: "top-center",
          closeOnClick: true,
        });
      } else if (data.status === 400) {
        // هنا بنتعامل مع response data
        if (data.response.data === "Registration not Complete") {
          toast.warning("Registration not complete!", {
            position: "top-center",
            closeOnClick: true,
          });
          navigate("../CompleteSignup");
        } else if (data.response.data === "Not Verified") {
          toast.warning("Account not verified!", {
            position: "top-center",
            closeOnClick: true,
          });
          // try{
          //   await sendOTPMutation.mutateAsync({email:})
          // }catch(err){
          //   console.log(err)
          // }
        }
      } else {
        toast.error("Something went wrong, try again later!", {
          position: "top-center",
          closeOnClick: true,
        });
      }

      /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
      //not completed yet
    },
  });
};
