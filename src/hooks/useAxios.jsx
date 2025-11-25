import axios from "axios";
import { useAuth } from "../Context/AuthContext";

export const useAxios = () => {
  const { accessToken, login, logout } = useAuth();

  const instance = axios.create({
    baseURL: "https://dactra.runasp.net/api/",
    withCredentials: true,
  });

  instance.interceptors.request.use((config) => {
    if (accessToken) config.headers.Authorization = `Bearer ${accessToken}`;
    return config;
  });

  instance.interceptors.response.use(
    (res) => res,
    async (error) => {
      if (error.response?.status === 401) {
        try {
          await instance.post("account/refresh");
        } catch (err) {}
      }
    }
  );
};
