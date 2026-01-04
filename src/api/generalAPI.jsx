import { useAxios } from "../hooks/useAxios";

export const useGeneralAPI = () => {
  const axiosInstance = useAxios();

  const getCities = async () => {
    const res = await axiosInstance.get("City");
    return res.data;
  };

  const getAllAllergies = async () => {
    const res = await axiosInstance.get("Allergy");
    return res.data;
  };

  const getAllChronic = async () => {
    const res = await axiosInstance.get("ChronicDisease");
    return res.data;
  };

  return { getCities, getAllAllergies, getAllChronic };
};
