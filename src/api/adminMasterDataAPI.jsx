import { useAxios } from "../hooks/useAxios";

// Admin master-data CRUD for Allergies, Majors, Chronic Diseases
export const useAdminMasterDataAPI = () => {
  const axiosInstance = useAxios();

  // Allergies
  const getAllAllergies = async () => {
    const res = await axiosInstance.get("Allergy");
    return res.data;
  };

  const addAllergy = async ({ name }) => {
    // Swagger: POST /api/Allergy?name=...
    const res = await axiosInstance.post("Allergy", null, {
      params: { name },
    });
    return res.data;
  };

  const updateAllergy = async (id, { name }) => {
    // Swagger: PUT /api/Allergy/{id}?name=...
    const res = await axiosInstance.put(`Allergy/${id}`, null, {
      params: { name },
    });
    return res.data;
  };

  const deleteAllergy = async (id) => {
    const res = await axiosInstance.delete(`Allergy/${id}`);
    return res.data;
  };

  // Chronic Diseases
  const getAllChronic = async () => {
    const res = await axiosInstance.get("ChronicDisease");
    return res.data;
  };

  const addChronic = async ({ name }) => {
    // Swagger: POST /api/ChronicDisease?name=...
    const res = await axiosInstance.post("ChronicDisease", null, {
      params: { name },
    });
    return res.data;
  };

  const updateChronic = async (id, { name }) => {
    // Swagger: PUT /api/ChronicDisease/{id}?name=...
    const res = await axiosInstance.put(`ChronicDisease/${id}`, null, {
      params: { name },
    });
    return res.data;
  };

  const deleteChronic = async (id) => {
    const res = await axiosInstance.delete(`ChronicDisease/${id}`);
    return res.data;
  };

  // Majors (specializations)
  const getAllMajors = async () => {
    // Swagger: GET /api/Majors/GetAll
    const res = await axiosInstance.get("Majors/GetAll");
    return res.data;
  };

  const addMajor = async ({ name, iconPath, description }) => {
    // Swagger: POST /api/Majors with JSON body
    const body = {
      name,
      iconpath: iconPath || "",
      description: description || "",
    };
    const res = await axiosInstance.post("Majors", body);
    return res.data;
  };

  const updateMajor = async (id, { name, iconPath, description }) => {
    const body = {
      name,
      iconpath: iconPath || "",
      description: description || "",
    };
    const res = await axiosInstance.put(`Majors/${id}`, body);
    return res.data;
  };

  const deleteMajor = async (id) => {
    const res = await axiosInstance.delete(`Majors/${id}`);
    return res.data;
  };

  return {
    getAllAllergies,
    addAllergy,
    updateAllergy,
    deleteAllergy,
    getAllChronic,
    addChronic,
    updateChronic,
    deleteChronic,
    getAllMajors,
    addMajor,
    updateMajor,
    deleteMajor,
  };
};

