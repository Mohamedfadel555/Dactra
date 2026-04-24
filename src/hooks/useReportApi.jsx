import { useMemo } from "react";
import { useAxios } from "./useAxios";

/**
 * Report API (Swagger): POST /api/Report
 * { type, title, content, relatedEntityId } — type: 0 Post, 1 Comment, 2 Question
 */
export function useReportApi() {
  const axios = useAxios();
  return useMemo(
    () => ({
      createReport: (body) => axios.post("Report", body),
      getAllReports: () => axios.get("Report/getAll"),
      getReportById: (id) => axios.get(`Report/${id}`),
      deleteReport: (id) => axios.delete(`Report/${id}`),
    }),
    [axios],
  );
}
