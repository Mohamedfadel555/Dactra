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
  lab: CompleteMedicalProviderRegisterAPI,
  lap: CompleteMedicalProviderRegisterAPI,
  medicaltestsprovider: CompleteMedicalProviderRegisterAPI,
  medicaltestprovider: CompleteMedicalProviderRegisterAPI,
  provider: CompleteMedicalProviderRegisterAPI,
};

const getCompletionFn = (userType) => {
  const k = String(userType || "").toLowerCase();
  return COMPLETE_API_BY_ROLE[k] || COMPLETE_API_BY_ROLE.patient;
};

const getErrorMessage = (error) => {
  const data = error?.response?.data;
  const serverMsg =
    (typeof data?.message === "string" && data.message.trim()) ||
    (typeof data?.title === "string" && data.title.trim()) ||
    null;
  if (serverMsg) return serverMsg;

  const status = error?.response?.status ?? error?.status;
  if (status === 400) {
    return "Please review the provided data and try again.";
  }
  if (status === 404) {
    return "We couldn't find your account. Please restart the signup flow.";
  }
  return "Something went wrong while completing your profile. Please try again.";
};

function isMedicalProviderCompletePayload(data) {
  const r = String(data?.role ?? "").toLowerCase();
  return r === "scan" || r === "lab" || r === "lap";
}

export const useCompleteSignup = (userType = "patient") => {
  return useMutation({
    mutationFn: async (data) => {
      if (isMedicalProviderCompletePayload(data)) {
        return CompleteMedicalProviderRegisterAPI(data);
      }
      const fn = getCompletionFn(userType);
      return fn(data);
    },
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

