import { useAxios } from "../hooks/useAxios";

export const useUserAPI = () => {
  const axiosInstance = useAxios();

  const getMePatient = async () => {
    const res = await axiosInstance.get("Patient/GetMe");
    return res.data;
  };
  const getMeDoctor = async () => {
    const res = await axiosInstance.get("Doctor/GetMe");
    return res.data;
  };

  const editPatientProfile = async (Data) => {
    const res = await axiosInstance.put("Patient", Data);
    return res;
  };

  const changePasswordAPI = async (Data) => {
    const res = await axiosInstance.post("account/change-password", Data);
    return res;
  };

  return { getMePatient, getMeDoctor, editPatientProfile, changePasswordAPI };
};
