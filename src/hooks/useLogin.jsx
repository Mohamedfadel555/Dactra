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
      toast.success("Logged in successfully!", {
        position: "top-center",
        closeOnClick: true,
      });
    },

    onError: async (data) => {
      if (data.status === 401) {
        toast.error("Email or password is invalid!", {
          position: "top-center",
          closeOnClick: true,
        });
      } else if (data.status === 400) {
        if (data.response.data.massage === "Registration not Completed") {
          toast.warning("Registration not complete!", {
            position: "top-center",
            closeOnClick: true,
            autoClose: 2000,
          });
          navigate("../CompleteSignup", {
            state: {
              email: data.response.data.email,
              userType: data.response.data.role[0],
            },
          });
        } else if (data.response.data.massage === " not verified") {
          toast.warning("Account not verified!", {
            position: "top-center",
            closeOnClick: true,
            autoClose: 2000,
          });
          try {
            const res = await sendOTPMutation.mutateAsync({
              email: data.response.data.email,
            });
            if (res.status === 200) {
              navigate("/auth/OTPVerify", {
                state: {
                  email: data.response.data.email,
                  userType: data.response.data.role[0],
                },
              });
            }
          } catch (err) {}
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
