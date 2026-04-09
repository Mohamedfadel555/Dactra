import { useAxios } from "../hooks/useAxios";
import {
  toPascalMedicalProviderUpdateDto,
  toCamelMedicalProviderUpdateDto,
} from "../utils/medicalProviderDto";

const asArray = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.$values)) return data.$values;
  return [];
};

const userIdFromToken = (token) => {
  if (!token) return null;
  try {
    const p = JSON.parse(atob(token.split(".")[1]));
    const n = p.nameid;
    return Array.isArray(n) ? n[0] : n;
  } catch {
    return null;
  }
};

/**
 * Lab / Scan portal: MedicalTestsProvider (profile + working hours),
 * TestService catalog, ProviderOffering (price + duration per service).
 */
export const useProviderPortalAPI = () => {
  const axiosInstance = useAxios();

  const getMedicalProviderMe = async () => {
    const res = await axiosInstance.get("MedicalTestsProvider/GetMe");
    return res?.data ?? null;
  };

  const getMedicalProviderByUserId = async (userId) => {
    const res = await axiosInstance.get(
      `MedicalTestsProvider/GetByUserId/${encodeURIComponent(userId)}`,
    );
    return res?.data ?? null;
  };

  const updateMedicalProvider = async (payload) => {
    const pascalBody = toPascalMedicalProviderUpdateDto(payload);
    try {
      const res = await axiosInstance.put(
        "MedicalTestsProvider",
        pascalBody,
      );
      return res?.data;
    } catch (err) {
      const status = err?.response?.status;
      if (status === 400 || status === 415 || status === 422) {
        const camelBody = toCamelMedicalProviderUpdateDto(payload);
        const res2 = await axiosInstance.put(
          "MedicalTestsProvider",
          camelBody,
        );
        return res2?.data;
      }
      throw err;
    }
  };

  const getTestServices = async () => {
    const res = await axiosInstance.get("TestService");
    return asArray(res?.data);
  };

  const createTestService = async (body) => {
    const res = await axiosInstance.post("TestService", body);
    return res?.data;
  };

  const updateTestService = async (id, body) => {
    const res = await axiosInstance.put(`TestService/${id}`, body);
    return res?.data;
  };

  const deleteTestService = async (id) => {
    await axiosInstance.delete(`TestService/${id}`);
  };

  const getProviderOfferings = async (providerId) => {
    const res = await axiosInstance.get(
      `ProviderOffering/provider/${providerId}`,
    );
    return asArray(res?.data);
  };

  /** All offerings (for patient home/list — group by provider). */
  const getAllProviderOfferings = async () => {
    const res = await axiosInstance.get("ProviderOffering");
    return asArray(res?.data);
  };

  const createProviderOffering = async (body) => {
    const res = await axiosInstance.post("ProviderOffering", body);
    return res?.data;
  };

  const updateProviderOffering = async (id, body) => {
    const res = await axiosInstance.put(`ProviderOffering/${id}`, body);
    return res?.data;
  };

  const deleteProviderOffering = async (id) => {
    await axiosInstance.delete(`ProviderOffering/${id}`);
  };

  return {
    getMedicalProviderMe,
    getMedicalProviderByUserId,
    updateMedicalProvider,
    getTestServices,
    createTestService,
    updateTestService,
    deleteTestService,
    getProviderOfferings,
    createProviderOffering,
    updateProviderOffering,
    deleteProviderOffering,
    getAllProviderOfferings,
    userIdFromToken,
  };
};
