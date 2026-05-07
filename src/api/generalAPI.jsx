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

  const getSiteReviews = async () => {
    const res = await axiosInstance.get("SiteReviews");
    return res.data;
  };

  const sendReview = async (Data) => {
    console.log(Data);
    const res = await axiosInstance.post("SiteReviews", Data);
    return res;
  };

  return {
    getCities,
    getAllAllergies,
    getAllChronic,
    getSiteReviews,
    sendReview,
  };
};
