import { useMutation } from "@tanstack/react-query";
import { useRefreshApi } from "../api/authAPI";
import { useAuth } from "../Context/AuthContext";
import { mapAppRoleFromToken } from "../utils/authRole";

export const useRefresh = () => {
  const { refreshApi } = useRefreshApi();
  const { login, logout } = useAuth();
  return useMutation({
    mutationFn: refreshApi,
    onSuccess: (data) => {
      const newAccessToken = data.data.accessToken;
      console.log(newAccessToken);
      login(newAccessToken, mapAppRoleFromToken(newAccessToken));
    },
    onError: () => {
      logout();
    },
  });
};
