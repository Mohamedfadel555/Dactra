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
  const res = await axios.post(`${baseURL}account/Register`, Data);
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
  const res = await axios.post(`${baseURL}account/verifyOTP`, Data);
  return res;
};

export const ResetPassword = async (Data) => {
  const res = await axios.post(`${baseURL}account/reset-password`, Data);
  return res;
};

export const CompletePatientRegisterAPI = async (Data) => {
  const res = await axios.post(`${baseURL}Patient/CompleteRegister`, Data);
  return res;
};

export const CompleteDoctorRegisterAPI = async (Data) => {
  const res = await axios.post(`${baseURL}Doctor/CompleteRegister`, Data);
  return res;
};

export const CompleteMedicalProviderRegisterAPI = async (Data) => {
  const res = await axios.post(
    `${baseURL}MedicalTestsProvider/CompleteRegister`,
    Data
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
    return axiosInstance.post("account/refresh");
  };

  return { refreshApi };
};

//write here all api function of Auth
