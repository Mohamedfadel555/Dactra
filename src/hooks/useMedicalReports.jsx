import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useUserAPI } from "../api/userAPI";

const QUERY_KEY = ["medicalReports"];

export const useGetMyReports = () => {
  const { getMyReports } = useUserAPI();
  return useQuery({
    queryKey: QUERY_KEY,
    queryFn: getMyReports,
  });
};

export const useGetPatientReports = (patientId, role) => {
  const { getPatientReports } = useUserAPI();
  return useQuery({
    queryKey: ["medicalReports", "patient", patientId],
    queryFn: () => getPatientReports(patientId),
    enabled: !!patientId && role !== "Doctor",
  });
};

export const useAddReport = () => {
  const { addReport } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Report uploaded successfully", { position: "top-center" });
    },
    onError: () => {
      toast.error("Failed to upload report, try again later", {
        position: "top-center",
      });
    },
  });
};

export const useDeleteReport = () => {
  const { deleteReport } = useUserAPI();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteReport,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      toast.success("Report deleted", { position: "top-center" });
    },
    onError: () => {
      toast.error("Failed to delete report, try again later", {
        position: "top-center",
      });
    },
  });
};
