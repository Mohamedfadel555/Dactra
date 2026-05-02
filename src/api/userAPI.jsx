import { useAxios } from "../hooks/useAxios";

export const useUserAPI = () => {
  const axiosInstance = useAxios();
  const asArray = (data) => {
    if (Array.isArray(data)) return data;
    if (Array.isArray(data?.items)) return data.items;
    if (Array.isArray(data?.$values)) return data.$values;
    if (Array.isArray(data?.data)) return data.data;
    if (Array.isArray(data?.data?.items)) return data.data.items;
    if (Array.isArray(data?.data?.$values)) return data.data.$values;
    return [];
  };

  const getMePatient = async () => {
    const res = await axiosInstance.get("Patient/GetMe");
    return res.data;
  };
  const getMeDoctor = async () => {
    const res = await axiosInstance.get("Doctor/GetMe");
    return res.data;
  };

  const editPatientProfile = async (Data) => {
    const res = await axiosInstance.put("Patient", Data);
    return res;
  };

  const editDcotorProfile = async (Data) => {
    const res = await axiosInstance.put("Doctor", Data);
    return res;
  };

  const changePasswordAPI = async (Data) => {
    const res = await axiosInstance.post("account/change-password", Data);
    return res;
  };

  const getMyQualifications = async () => {
    const res = await axiosInstance.get("Doctor/qualifications/me");
    return res.data;
  };

  const addQualification = async (Data) => {
    const res = await axiosInstance.post("Doctor/qualifications", Data);
    return res;
  };

  const deleteQualification = async (Id) => {
    const res = await axiosInstance.delete(`Doctor/qualifications/${Id}`);
    return res;
  };

  const deleteMyAcc = async () => {
    const res = await axiosInstance.delete("account/DeleteMe");
    return res;
  };

  const getMyRatings = async () => {
    const res = await axiosInstance.get("Rating/provider/my-ratings");
    return res.data;
  };

  const addVital = async (Data) => {
    const res = await axiosInstance.post("Patient/vitals", Data);
    return res;
  };

  const getVitals = async () => {
    const res = await axiosInstance.get("Patient/vitals");
    return res.data;
  };

  const getMyAllergies = async () => {
    const res = await axiosInstance.get("Patient/allergies");
    return res.data;
  };

  const getMyChronic = async () => {
    const res = await axiosInstance.get("Patient/chronic-diseases");
    return res.data;
  };

  const editAllergies = async (data) => {
    const res = await axiosInstance.put("Patient/allergies", data);
    return res;
  };
  const editchronics = async (data) => {
    const res = await axiosInstance.put("Patient/chronic-diseases", data);
    return res;
  };

  const getDoctorProfile = async (Id) => {
    const res = await axiosInstance.get(`Doctor/${Id}`);
    return res.data;
  };
  const getPatientProfile = async (Id) => {
    const res = await axiosInstance.get(`Patient/${Id}`);
    return res.data;
  };

  const getSiteReviews = async () => {
    const res = await axiosInstance.get("SiteReviews");
    return asArray(res?.data);
  };

  const getSiteReviewsStats = async () => {
    const res = await axiosInstance.get("SiteReviews/stats");
    const data = res?.data;
    return data?.data ?? data;
  };

  const getSiteReviewsDistribution = async () => {
    const res = await axiosInstance.get("SiteReviews/distribution");
    const data = res?.data;
    return data?.data ?? data;
  };

  const createSiteReview = async (body) => {
    try {
      const res = await axiosInstance.post("SiteReviews", body);
      return res?.data?.data ?? res?.data;
    } catch (err) {
      if (err?.response?.status === 400) {
        const fallbackBody = {
          Title: body?.title,
          Score: body?.score,
          Comment: body?.comment,
        };
        const res2 = await axiosInstance.post("SiteReviews", fallbackBody);
        return res2?.data?.data ?? res2?.data;
      }
      throw err;
    }
  };

  const getTopRatedDoctors = async (count = 10) => {
    const res = await axiosInstance.get("Home/top-rated-doctors", {
      params: { count },
    });
    return asArray(res?.data);
  };

  const getPatientProviderRatings = async () => {
    const res = await axiosInstance.get("Rating/patient/my-ratings");
    return asArray(res?.data);
  };

  const rateProvider = async (providerId, body) => {
    const res = await axiosInstance.post(
      `Rating/patient/rate-provider/${providerId}`,
      body,
    );
    return res?.data;
  };

  const updateProviderRating = async (providerId, body) => {
    const res = await axiosInstance.put(
      `Rating/patient/rate-provider/${providerId}`,
      body,
    );
    return res?.data;
  };

  const deleteProviderRating = async (providerId) => {
    const res = await axiosInstance.delete(
      `Rating/patient/rate-provider/${providerId}`,
    );
    return res?.data;
  };

  const getUserImage = async () => {
    const res = await axiosInstance.get("UserImage");
    return res?.data;
  };

  const createUserImage = async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await axiosInstance.post("UserImage", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res?.data;
  };

  const updateUserImage = async (file) => {
    const form = new FormData();
    form.append("file", file);
    const res = await axiosInstance.put("UserImage", form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res?.data;
  };

  const deleteUserImage = async () => {
    const res = await axiosInstance.delete("UserImage");
    return res?.data;
  };

  return {
    getMePatient,
    getMeDoctor,
    editPatientProfile,
    editDcotorProfile,
    changePasswordAPI,
    getMyQualifications,
    addQualification,
    deleteQualification,
    deleteMyAcc,
    getMyRatings,
    addVital,
    getVitals,
    getMyAllergies,
    getMyChronic,
    editAllergies,
    editchronics,
    getDoctorProfile,
    getPatientProfile,
    getSiteReviews,
    getSiteReviewsStats,
    getSiteReviewsDistribution,
    createSiteReview,
    getTopRatedDoctors,
    getPatientProviderRatings,
    rateProvider,
    updateProviderRating,
    deleteProviderRating,
    getUserImage,
    createUserImage,
    updateUserImage,
    deleteUserImage,
  };
};
