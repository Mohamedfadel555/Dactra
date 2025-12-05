import { useAxios } from "../hooks/useAxios";

export const useGeneralAPI = () => {
  const axiosInstance = useAxios();

  const getCities = async () => {
    const res = await axiosInstance.get("City");
    return res.data;
  };

  return { getCities };
};
