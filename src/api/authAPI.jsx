//importing axios
import axios from "axios";

//the Base URL for all apis
const baseURL = "https://dactra.runasp.net/api/";

//make function return the respones of api
export const LoginAPI = async (Data) => {
  const res = await axios.post(`${baseURL}account/Login`, Data);
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

//write here all api function of Auth
