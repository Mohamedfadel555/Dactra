import { useMemo } from "react";
import { useAxios } from "./useAxios";

/**
 * POST /api/Complaints  { title, content, against }
 * GET /api/Complaints | /my | /{id}
 * PUT /api/Complaints/{id}
 */
export function useComplaintsApi() {
  const axios = useAxios();
  return useMemo(
    () => ({
      createComplaint: (body) => axios.post("Complaints", body),
      getAllComplaints: () => axios.get("Complaints"),
      getMyComplaints: () => axios.get("Complaints/my"),
      getComplaintById: (id) => axios.get(`Complaints/${id}`),
      updateComplaint: (id, body) => axios.put(`Complaints/${id}`, body),
    }),
    [axios],
  );
}
