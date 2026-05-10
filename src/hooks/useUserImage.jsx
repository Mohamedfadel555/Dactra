import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { useAuth } from "../Context/AuthContext";

export const useUserImage = () => {
  const { getUserImage } = useUserAPI();
  const { accessToken } = useAuth();
  return useQuery({
    queryKey: ["userImage"],
    queryFn: getUserImage,
    enabled: !!accessToken,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCreateUserImage = () => {
  const { createUserImage } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createUserImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userImage"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useUpdateUserImage = () => {
  const { updateUserImage } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateUserImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userImage"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};

export const useDeleteUserImage = () => {
  const { deleteUserImage } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteUserImage,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userImage"] });
      queryClient.invalidateQueries({ queryKey: ["user"] });
    },
  });
};
