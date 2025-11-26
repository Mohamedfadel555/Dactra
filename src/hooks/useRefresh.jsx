import { useMutation } from "@tanstack/react-query";
import { useRefreshApi } from "../api/authAPI";
import { useAuth } from "../Context/AuthContext";

export const useRefresh = () => {
  const { refreshApi } = useRefreshApi();
  const { login, logout } = useAuth();
  return useMutation({
    mutationFn: refreshApi,
    onSuccess: (data) => {
      const newAccessToken = data.data.accessToken;
      login(
        newAccessToken,
        JSON.parse(atob(newAccessToken.split(".")[1])).role
      );
    },
    onError: () => {
      logout();
    },
  });
};
