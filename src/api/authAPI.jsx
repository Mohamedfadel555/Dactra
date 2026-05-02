//importing axios
import axios from "axios";
import { useAxios } from "../hooks/useAxios";

//the Base URL for all apis
const baseURL = "https://dactra.runasp.net/api/";

//make function return the respones of api
export const LoginAPI = async (Data) => {
  const res = await axios.post(`${baseURL}account/Login`, Data, {
    withCredentials: true,
  });
  return res;
};

export const RegisterAPI = async (Data) => {
  const res = await axios.post(`${baseURL}account/Register`, Data, {
    withCredentials: true,
  });
  return res;
};

export const SendOTP = async (Data) => {
  const res = await axios.post(`${baseURL}account/SendOTP`, Data);
  return res;
};

export const ReSendOTP = async (Data) => {
  const res = await axios.post(`${baseURL}account/resendOTP`, Data);
  return res;
};

export const VerifyOTP_ForgetPassword = async (Data) => {
  const res = await axios.post(
    `${baseURL}account/verifyOTP_Forgetpassword`,
    Data
  );
  return res;
};

export const VerifyOTP = async (Data) => {
  const res = await axios.post(`${baseURL}account/verifyOTP`, Data, {
    withCredentials: true,
  });
  return res;
};

export const ResetPassword = async (Data) => {
  const res = await axios.post(`${baseURL}account/reset-password`, Data);
  return res;
};

export const CompletePatientRegisterAPI = async (Data) => {
  const res = await axios.post(`${baseURL}Patient/CompleteRegister`, Data, {
    withCredentials: true,
  });
  return res;
};

export const CompleteDoctorRegisterAPI = async (Data) => {
  const res = await axios.post(`${baseURL}Doctor/CompleteRegister`, Data, {
    withCredentials: true,
  });
  return res;
};

/**
 * Must align with account/Register role: "Scan" | "Lap" (see Signup capitalizeFirstLetter).
 * Provider entity type: 0 = Lab, 1 = Scan (matches useMedicalProviderMe list filter).
 */
export const CompleteMedicalProviderRegisterAPI = async (Data) => {
  const roleLower = String(Data?.role ?? "").toLowerCase();
  const roleStr = roleLower === "scan" ? "Scan" : "Lap";
  const typeNum = roleStr === "Scan" ? 1 : 0;

  const wh = Array.isArray(Data?.workingHours)
    ? Data.workingHours
    : Array.isArray(Data?.workinghours)
      ? Data.workinghours
      : [];

  const workingHours = wh.map((w) => {
    const day = Number(w.day ?? w.Day);
    const from = String(w.from ?? w.From ?? "");
    const to = String(w.to ?? w.To ?? "");
    return { day, from, to };
  });

  // Single camelCase payload avoids duplicate JSON keys confusing ASP.NET model binding.
  const body = {
    email: Data.email,
    role: roleStr,
    name: Data.name,
    licenceNo: Data.licenceNo,
    address: Data.address,
    about: Data.about ?? "",
    type: typeNum,
    workingHours,
  };

  const res = await axios.post(
    `${baseURL}MedicalTestsProvider/CompleteRegister`,
    body,
    { withCredentials: true },
  );
  return res;
};

export const getMajorsAPI = async () => {
  const res = await axios.get(`${baseURL}Majors/GetAll`);
  return res;
};

export const LogoutAPI = async () => {
  const res = await axios.post(
    `${baseURL}account/logout`,
    {},
    { withCredentials: true }
  );
  return res;
};

export const useRefreshApi = () => {
  const axiosInstance = useAxios();

  const refreshApi = async () => {
    return await axiosInstance.post("account/refresh");
  };

  return { refreshApi };
};

//write here all api function of Auth
