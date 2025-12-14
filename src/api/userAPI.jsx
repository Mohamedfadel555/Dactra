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

  const editDcotorProfile = async (Data) => {
    const res = await axiosInstance.put("Doctor", Data);
    return res;
  };

  const changePasswordAPI = async (Data) => {
    const res = await axiosInstance.post("account/change-password", Data);
    return res;
  };

  const getMyQualifications = async () => {
    const res = await axiosInstance.get("Doctor/qualifications/me");
    return res.data;
  };

  const addQualification = async (Data) => {
    const res = await axiosInstance.post("Doctor/qualifications", Data);
    return res;
  };

  const deleteQualification = async (Id) => {
    const res = await axiosInstance.delete(`Doctor/qualifications/${Id}`);
    return res;
  };

  const deleteMyAcc = async () => {
    const res = await axiosInstance.delete("account/DeleteMe");
    return res;
  };

  const getMyRatings = async () => {
    const res = await axiosInstance.get("Rating/provider/my-ratings");
    return res.data;
  };

  const addVital = async (Data) => {
    const res = await axiosInstance.post("Patient/vitals", Data);
    return res;
  };

  const getVitals = async () => {
    const res = await axiosInstance.get("Patient/vitals");
    return res.data;
  };

  return {
    getMePatient,
    getMeDoctor,
    editPatientProfile,
    editDcotorProfile,
    changePasswordAPI,
    getMyQualifications,
    addQualification,
    deleteQualification,
    deleteMyAcc,
    getMyRatings,
    addVital,
    getVitals,
  };
};
