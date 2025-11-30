import { useAxios } from "../hooks/useAxios";

export const useUserAPI = () => {
  const axiosInstance = useAxios();

  const getMe = async () => {
    const res = await axiosInstance.get("Patient/GetMe");
    return res.data;
  };

  return { getMe };
};
