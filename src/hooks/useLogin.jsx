//import toast for notifications
import { toast } from "react-toastify";
//import the api
import { LoginAPI } from "../api/authAPI";

//import mutation of react query
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { useSendOTP } from "./useSendOTP";
import { useAuth } from "../Context/AuthContext";

export const useLogin = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const sendOTPMutation = useSendOTP();
  return useMutation({
    mutationFn: LoginAPI,
    onSuccess: async (data) => {
      const tokenPayload = JSON.parse(atob(data.data.token.split(".")[1]));
      console.log(data);
      const role = tokenPayload.role;
      await login(data.data.token, role);
      toast.success("Logged in successfully!", {
        position: "top-center",
        closeOnClick: true,
      });
      const normalizedRole = role?.toLowerCase();
      if (normalizedRole === "admin" || normalizedRole === "administrator") {
        navigate("/admin/dashboard", { replace: true });
      } else {
        navigate("/", { replace: true });
      }
    },

    onError: async (data) => {
      console.log(data);
      if (data.status === 401) {
        toast.error("Email or password is invalid!", {
          position: "top-center",
          closeOnClick: true,
        });
      } else if (data.status === 404) {
        toast.error("This user has been blocked , Contact us to help", {
          position: "top-center",
          closeOnClick: true,
        });
      } else if (data.status === 400) {
        console.log(data);
        if (data.response.data.massage === "Registration not Completed") {
          toast.warning("Registration not complete!", {
            position: "top-center",
            closeOnClick: true,
            autoClose: 2000,
          });
          navigate("../CompleteSignup", {
            state: {
              email: data.response.data.email,
              userType: data.response.data.role[0].toLowerCase(),
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
                  userType: data.response.data.role[0].toLowerCase(),
                },
              });
            }
          } catch (err) {
            console.log(err);
          }
        }
      } else {
        toast.error("Something went wrong, try again later!", {
          position: "top-center",
          closeOnClick: true,
        });
      }
    },
  });
};
