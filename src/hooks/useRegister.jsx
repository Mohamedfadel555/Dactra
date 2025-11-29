import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { RegisterAPI } from "../api/authAPI";

const getErrorMessage = (error) => {
  const status = error?.response?.status ?? error?.status;
  if (
    status === 400 &&
    error.response.data[0].description === "Email is already registered."
  ) {
    return error?.response?.data?.message || "Email is already exist";
  }
  if (status === 409) {
    return "An account with this email already exists.";
  }
  return "Something went wrong while creating the account. Please try again.";
};

export const useRegister = () => {
  return useMutation({
    mutationFn: RegisterAPI,
    onSuccess: () => {
      toast.success(
        "Account created! Please verify the OTP sent to your email.",
        {
          position: "top-center",
          closeOnClick: true,
        }
      );
    },
    onError: (error) => {
      console.log(error);
      toast.error(getErrorMessage(error), {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};
