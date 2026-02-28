import { useAxios } from "../hooks/useAxios";

// Admin API functions using axios instance
export const useAdminAPI = () => {
  const axiosInstance = useAxios();

  // Get all admins
  const getAllAdmins = async () => {
    return axiosInstance.get("Admin/All");
  };

  // Get admin by ID
  const getAdminById = async (id) => {
    return axiosInstance.get(`Admin/getById/${id}`);
  };

  // Get admin by email
  const getAdminByEmail = async (email) => {
    return axiosInstance.get(`Admin/getByEmail?email=${email}`);
  };

  // Add admin
  const addAdmin = async (data) => {
    return axiosInstance.post("Admin/Add", data);
  };

  // Delete admin
  const deleteAdmin = async (id) => {
    return axiosInstance.delete(`Admin/DeleteAdmin/${id}`);
  };

  // Delete app user (used for blocking)
  const deleteAppUser = async (id) => {
    return axiosInstance.delete(`Admin/DeleteAppUser/${id}`);
  };

  // Delete post (article)
  const deletePost = async (id) => {
    return axiosInstance.delete(`Admin/DeletePost${id}`);
  };

  // Delete question
  const deleteQuestion = async (id) => {
    return axiosInstance.delete(`Admin/DeleteQuestion${id}`);
  };

  // Get summary stats (doctorsCount, patientsCount, labCount, scanCount)
  const getSummary = async () => {
    return axiosInstance.get("Admin/summary");
  };

  // Get weekly summary (appointments per day)
  const getWeeklySummary = async () => {
    return axiosInstance.get("Admin/weekly-summary");
  };

  // Get all patient info with pagination + optional search
  const getAllPatientInfo = async (
    pageNumber = 1,
    pageSize = 10,
    searchTerm = null
  ) => {
    const params = {
      page: pageNumber,
      pageSize,
    };

    // Optional search parameter (nullable on backend)
    if (searchTerm) {
      params.SearchTerm = searchTerm;
    }

    return axiosInstance.get("Admin/allPetientInfo", {
      params,
    });
  };


  // Get all doctors info with pagination + optional search & approvalStatus filter
  const getAllDoctorsInfo = async (
    pageNumber = 1,
    pageSize = 10,
    searchTerm = null,
    status = null
  ) => {
    const params = {
      page: pageNumber,
      pageSize,
    };

    if (searchTerm) {
      // Swagger: searchName
      params.searchName = searchTerm;
    }

    // approvalStatus: null = all, 0 = new/pending, 1 = approved, 2 = rejected
    if (status !== null && status !== undefined && status !== "") {
      params.approvalStatus = status;
    }

    return axiosInstance.get("Admin/allDoctorsInfo", {
      params,
    });
  };

  // Get all labs info with pagination + optional search & approvalStatus filter
  const getAllLabsInfo = async (
    pageNumber = 1,
    pageSize = 10,
    searchTerm = null,
    status = null
  ) => {
    const params = {
      page: pageNumber,
      pageSize,
    };

    if (searchTerm) {
      params.searchName = searchTerm;
    }

    if (status !== null && status !== undefined && status !== "") {
      params.approvalStatus = status;
    }

    return axiosInstance.get("Admin/allLabsInfo", {
      params,
    });
  };

  // Get all scans info with pagination + optional search & approvalStatus filter
  const getAllScansInfo = async (
    pageNumber = 1,
    pageSize = 10,
    searchTerm = null,
    status = null
  ) => {
    const params = {
      page: pageNumber,
      pageSize,
    };

    if (searchTerm) {
      params.searchName = searchTerm;
    }

    if (status !== null && status !== undefined && status !== "") {
      params.approvalStatus = status;
    }

    return axiosInstance.get("Admin/allScansInfo", {
      params,
    });
  };

  // Approve provider (doctor, lab, scan)
  const approveProvider = async (providerType, providerId) => {
    return axiosInstance.put("Admin/approve-Provider", {
      providerType,
      providerId,
    });
  };

  // Disapprove provider (doctor, lab, scan)
  const disapproveProvider = async (providerType, providerId) => {
    return axiosInstance.put("Admin/disapprove-Provider", {
      providerType,
      providerId,
    });
  };


  // Get all questions info
  const getAllQuestionsInfo = async () => {
    return axiosInstance.get("Admin/allquestionsInfo");
  };

  // Get all articles info
  const getAllArticlesInfo = async () => {
    return axiosInstance.get("Admin/allArticlesInfo");
  };

  // Seed (if needed)
  const seed = async () => {
    return axiosInstance.get("Admin/Seed");
  };

  return {
    getAllAdmins,
    getAdminById,
    getAdminByEmail,
    addAdmin,
    deleteAdmin,
    deleteAppUser,
    deletePost,
    deleteQuestion,
    getSummary,
    getWeeklySummary,
    getAllPatientInfo,
    getAllDoctorsInfo,
    getAllLabsInfo,
    getAllScansInfo,
    approveProvider,
    disapproveProvider,

    getAllQuestionsInfo,
    getAllArticlesInfo,
    seed,
  };
};

