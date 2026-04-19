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
      console.log("Login success payload:", tokenPayload);

      // Try to extract role from different possible claim keys
      let rawRole =
        tokenPayload.role ||
        tokenPayload.roles ||
        tokenPayload[
          "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
        ];

      const typeValue = tokenPayload.tv; // "0" for lab, "1" for scan (from backend)

      if (Array.isArray(rawRole)) {
        rawRole = rawRole[0];
      }

      const normalizedRole = (
        rawRole && typeof rawRole === "string" ? rawRole : ""
      ).toLowerCase();

      // Map backend roles to app roles (used across the app)
      let appRole = rawRole;
      if (normalizedRole === "admin" || normalizedRole === "administrator") {
        appRole = "Admin";
      } else if (normalizedRole === "lab" || normalizedRole === "lap") {
        appRole = "Lab";
      } else if (normalizedRole === "scan" || normalizedRole === "scancenter") {
        appRole = "Scan";
      } else if (normalizedRole === "medicaltestprovider") {
        // MedicalTestProvider: decide Lab vs Scan based on tv claim
        if (typeValue === "0" || typeValue === 0) {
          appRole = "Lab";
        } else if (typeValue === "1" || typeValue === 1) {
          appRole = "Scan";
        } else {
          appRole = "Lab";
        }
      }

      await login(data.data.token, appRole);
      toast.success("Logged in successfully!", {
        position: "top-center",
        closeOnClick: true,
      });

      const navRole = (
        appRole && typeof appRole === "string" ? appRole : ""
      ).toLowerCase();
      if (navRole === "admin" || navRole === "administrator") {
        navigate("/admin/dashboard", { replace: true });
      } else if (navRole === "lab" || navRole === "lap") {
        navigate("/lab", { replace: true });
      } else if (navRole === "scan") {
        navigate("/scan", { replace: true });
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
