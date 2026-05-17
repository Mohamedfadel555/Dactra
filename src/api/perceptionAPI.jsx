import { useAxios } from "../hooks/useAxios";

export const usePerceptionAPI = () => {
  const axiosInstance = useAxios();

  const savePerception = async (Data) => {
    console.log(Data);
    const res = await axiosInstance.post("Prescriptions", Data);
    return res;
  };

  const getPrescriptionByAppointment = async (appointmentId) => {
    const res = await axiosInstance.get(
      `Prescriptions/appointment/${appointmentId}`,
    );
    return res.data;
  };

  const searchMedicines = async (query) => {
    if (!query || query.trim().length < 2) return [];
    const res = await axiosInstance.get("Medicines/search", {
      params: { query: query.trim() },
    });
    return res.data; // string[]
  };

  // ── Pharmacy Integration ───────────────────────────────────────────────────
  // POST /api/PharmacyIntegration/pharmacy
  // params: { prescriptionId, street, city, BuildingNo, country, governorate }
  const getNearbyPharmacies = async ({
    prescriptionId,
    street,
    city,
    BuildingNo,
    country,
    governorate,
  }) => {
    const res = await axiosInstance.post(
      "PharmacyIntegration/pharmacy",
      null, // no request body — كل الباراميترز query params
      {
        params: {
          prescriptionId,
          street,
          city,
          BuildingNo,
          country,
          governorate,
        },
      },
    );
    return res.data;
  };

  return {
    savePerception,
    getPrescriptionByAppointment,
    searchMedicines,
    getNearbyPharmacies,
  };
};
