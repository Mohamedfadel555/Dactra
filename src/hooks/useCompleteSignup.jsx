import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  CompletePatientRegisterAPI,
  CompleteDoctorRegisterAPI,
  CompleteMedicalProviderRegisterAPI,
} from "../api/authAPI";

const COMPLETE_API_BY_ROLE = {
  patient: CompletePatientRegisterAPI,
  doctor: CompleteDoctorRegisterAPI,
  scan: CompleteMedicalProviderRegisterAPI,
  lap: CompleteMedicalProviderRegisterAPI,
};

const getCompletionFn = (userType) =>
  COMPLETE_API_BY_ROLE[userType] || COMPLETE_API_BY_ROLE.patient;

const getErrorMessage = (error) => {
  const status = error?.response?.status ?? error?.status;
  if (status === 400) {
    return (
      error?.response?.data?.message ||
      "Please review the provided data and try again."
    );
  }
  if (status === 404) {
    return "We couldn't find your account. Please restart the signup flow.";
  }
  return "Something went wrong while completing your profile. Please try again.";
};

export const useCompleteSignup = (userType = "patient") => {
  const mutationFn = getCompletionFn(userType);
  return useMutation({
    mutationFn,
    onSuccess: () => {
      toast.success("Profile completed successfully!", {
        position: "top-center",
        closeOnClick: true,
      });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error), {
        position: "top-center",
        closeOnClick: true,
      });
    },
  });
};

