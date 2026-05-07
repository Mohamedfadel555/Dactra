import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useUserAPI } from "../api/userAPI";
import { useAuth } from "../Context/AuthContext";
import { toast } from "react-toastify";

export const usePatientProviderRatings = () => {
  const { getPatientProviderRatings } = useUserAPI();
  const { role, accessToken } = useAuth();
  const enabled = !!accessToken && (role || "").toLowerCase() === "patient";

  return useQuery({
    queryKey: ["patientProviderRatings"],
    queryFn: getPatientProviderRatings,
    enabled,
    staleTime: 1000 * 60 * 5,
    retry: 1,
  });
};
export const useGetProviderRatings = (providerId) => {
  const { fetchProviderRating } = useUserAPI();
  return useQuery({
    queryKey: ["providerRatings", providerId],
    queryFn: () => fetchProviderRating(providerId),
    enabled: Number.isFinite(Number(providerId)),
    staleTime: 1000 * 60 * 2,
  });
};

export const useRateProvider = () => {
  const { rateProviderr } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, body }) => rateProviderr(providerId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientProviderRatings"] });
      toast.success("Rating submitted.", { position: "top-center" });
    },
    onError: (err) => {
      const errs = err?.response?.data?.errors;
      if (errs && typeof errs === "object") {
        console.error(
          "Provider rating validation errors:",
          Object.entries(errs).flatMap(([k, v]) =>
            (Array.isArray(v) ? v : [String(v)]).map((m) => `${k}: ${m}`),
          ),
        );
      }
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "Could not submit rating.";
      toast.error(msg, { position: "top-center" });
    },
  });
};

export const useUpdateProviderRating = () => {
  const { updateProviderRating } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ providerId, body }) =>
      updateProviderRating(providerId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientProviderRatings"] });
      toast.success("Rating updated.", { position: "top-center" });
    },
    onError: (err) => {
      const errs = err?.response?.data?.errors;
      if (errs && typeof errs === "object") {
        console.error(
          "Provider rating validation errors:",
          Object.entries(errs).flatMap(([k, v]) =>
            (Array.isArray(v) ? v : [String(v)]).map((m) => `${k}: ${m}`),
          ),
        );
      }
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "Could not update rating.";
      toast.error(msg, { position: "top-center" });
    },
  });
};

export const useDeleteProviderRating = () => {
  const { deleteProviderRating } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (providerId) => deleteProviderRating(providerId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["patientProviderRatings"] });
      toast.success("Rating deleted.", { position: "top-center" });
    },
    onError: (err) => {
      const msg =
        err?.response?.data?.message ||
        err?.response?.data?.title ||
        "Could not delete rating.";
      toast.error(msg, { position: "top-center" });
    },
  });
};
