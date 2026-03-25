import { useAxios } from "../hooks/useAxios";

/**
 * Medical Tests Provider API (Labs & Scan Centers)
 * Base: GET https://dactra.runasp.net/api/MedicalTestsProvider
 * Response: [{ id, name, licenceNo, address, about, avg_Rating, type }]
 * type: 0 = Lab, 1 = Scan Center
 */
export const useProviderAPI = () => {
  const axiosInstance = useAxios();

  const getMedicalTestsProviders = async () => {
    const res = await axiosInstance.get("MedicalTestsProvider");
    const data = res?.data;
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.$values)) return data.$values;
    return [];
  };

  const getMedicalTestsProviderById = async (id) => {
    try {
      const res = await axiosInstance.get(`MedicalTestsProvider/${id}`);
      return res?.data;
    } catch (e) {
      if (e?.response?.status === 404 || !id) return null;
      const list = await getMedicalTestsProviders();
      return list.find((p) => String(p.id) === String(id)) || null;
    }
  };

  return {
    getMedicalTestsProviders,
    getMedicalTestsProviderById,
  };
};
