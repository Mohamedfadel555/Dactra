import { useAxios } from "../hooks/useAxios";

export const useSponsorshipAPI = () => {
  const axiosInstance = useAxios();

  // ── Doctor: Deals ──────────────────────────────────────────────
  /**
   * GET /api/Sponsorship/doctor/offers/by-status/{status}
   * status: 0 = received | 1 = rejected | 2 = counter
   */
  const getDoctorOffersByStatus = async (status, params) => {
    const res = await axiosInstance.get(
      `Sponsorship/doctor/offers/by-status/${status}`,
      { params },
    );
    return res.data;
  };

  /** GET /api/Sponsorship/doctor/offers/summary — counts by status */
  const getDoctorOffersSummary = async () => {
    const res = await axiosInstance.get("Sponsorship/doctor/offers/summary");
    return res.data;
  };

  /** PUT /api/Sponsorship/doctor/accept/{id} */
  const acceptDeal = async (sponsorshipId) => {
    const res = await axiosInstance.put(
      `Sponsorship/doctor/accept/${sponsorshipId}`,
    );
    return res;
  };

  /** PUT /api/Sponsorship/doctor/reject/{id} */
  const rejectDeal = async (sponsorshipId) => {
    const res = await axiosInstance.put(
      `Sponsorship/doctor/reject/${sponsorshipId}`,
    );
    return res;
  };

  /** PUT /api/Sponsorship/doctor/counter/{id} */
  const counterDeal = async (sponsorshipId, data) => {
    const res = await axiosInstance.put(
      `Sponsorship/doctor/counter/${sponsorshipId}`,
      data,
    );
    return res;
  };

  /** PUT /api/Sponsorship/doctor/cancel/{id} — cancel my counter offer */
  const cancelCounter = async (sponsorshipId) => {
    const res = await axiosInstance.put(
      `Sponsorship/doctor/cancel/${sponsorshipId}`,
    );
    return res;
  };

  // ── Doctor: Active Sponsors ─────────────────────────────────────
  /** GET /api/Sponsorship/doctor/active */
  const getActiveSponsors = async () => {
    const res = await axiosInstance.get("Sponsorship/doctor/active");
    return res.data;
  };

  /** DELETE /api/Sponsorship/doctor/offer/{id} — remove a sponsor */
  const removeSponsor = async (sponsorshipId) => {
    const res = await axiosInstance.delete(
      `Sponsorship/doctor/offer/${sponsorshipId}`,
    );
    return res;
  };

  // ── Doctor: Patients ────────────────────────────────────────────
  /** GET /api/PatientReferral/doctor/care-patients */
  const getCarePatients = async () => {
    const res = await axiosInstance.get("PatientReferral/doctor/care-patients");
    return res.data;
  };

  /** POST /api/PatientReferral/doctor/refer */
  const sendReferral = async (data) => {
    const res = await axiosInstance.post("PatientReferral/doctor/refer", data);
    return res;
  };

  // ── Provider: Referrals ─────────────────────────────────────────
  /**
   * GET /api/PatientReferral/provider/referrals
   * @param {{ page?: number, pageSize?: number, status?: 0 | 1 }} params
   *   status: 0 = pending | 1 = received | omit for all
   */
  const getProviderReferrals = async (params = {}) => {
    const res = await axiosInstance.get("PatientReferral/provider/referrals", {
      params,
    });
    return res.data;
  };

  /**
   * PUT /api/PatientReferral/provider/receive/{referralId}
   * Marks a pending referral as received
   */
  const receiveReferral = async (referralId) => {
    const res = await axiosInstance.put(
      `PatientReferral/provider/receive/${referralId}`,
    );
    return res;
  };

  // ── Provider (Lab/Scan) side ────────────────────────────────────
  const providerOffer = async (data) => {
    const res = await axiosInstance.post("Sponsorship/provider/offer", data);
    return res;
  };

  const providerOffers = async () => {
    const res = await axiosInstance.get("Sponsorship/provider/offers");
    return res.data;
  };

  const offersSummary = async () => {
    const res = await axiosInstance.get("Sponsorship/provider/offers/summary");
    return res.data;
  };

  const offersBYStat = async (id, params) => {
    const res = await axiosInstance.get(
      `Sponsorship/provider/offers/by-status/${id}`,
      { params },
    );
    return res.data;
  };

  const sponsoredDoctors = async (params) => {
    const res = await axiosInstance.get(
      "Sponsorship/provider/active-sponsors/overview",
      { params },
    );
    return res.data;
  };

  const providerAcceptCounter = async (Id) => {
    const res = await axiosInstance.put(
      `Sponsorship/provider/counter/${Id}/accept`,
    );
    return res;
  };

  const providerRejectCounter = async (Id) => {
    const res = await axiosInstance.put(
      `Sponsorship/provider/counter/${Id}/reject`,
    );
    return res;
  };

  const providerCancelDeal = async (Id) => {
    const res = await axiosInstance.put(`Sponsorship/provider/cancel/${Id}`);
    return res;
  };

  const providerCancelOffer = async (Id) => {
    const res = await axiosInstance.delete(`Sponsorship/provider/offer/${Id}`);
    return res;
  };

  const getLabServices = async (id) => {
    const res = await axiosInstance.get(`ProviderOffering/provider/${id}`);
    return res.data;
  };

  return {
    getDoctorOffersByStatus,
    getDoctorOffersSummary,
    acceptDeal,
    rejectDeal,
    counterDeal,
    cancelCounter,
    getActiveSponsors,
    removeSponsor,
    getCarePatients,
    sendReferral,
    getProviderReferrals,
    receiveReferral,
    providerOffer,
    providerOffers,
    offersSummary,
    offersBYStat,
    sponsoredDoctors,
    providerAcceptCounter,
    providerRejectCounter,
    providerCancelDeal,
    providerCancelOffer,
    getLabServices,
  };
};
