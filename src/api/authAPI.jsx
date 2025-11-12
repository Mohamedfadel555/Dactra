//importing axios
import axios from "axios";

//the Base URL for all apis
const baseURL = "http://dactra.runasp.net/api/";

//make function return the respones of api
export const LoginAPI = async (Data) => {
  const res = await axios.post(`${baseURL}account/Login`, Data);
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

export const VerifyOTP = async (Data) => {
  const res = await axios.post(`${baseURL}account/verifyOTP`, Data);
  return res;
};
//write here all api function of Auth
