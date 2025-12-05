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
      const originalRequest = error.config;
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const res = await axios.post(
            "https://dactra.runasp.net/api/account/refresh",
            {},
            { withCredentials: true }
          );
          const newAccessToken = res.data.accessToken;
          await login(
            newAccessToken,
            JSON.parse(atob(newAccessToken.split(".")[1])).role
          );
          originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
        } catch (err) {
          logout();
          return Promise.reject(err);
        }
      }
      return Promise.reject(error);
    }
  );
  return instance;
};
