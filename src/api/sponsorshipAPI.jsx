import { useAxios } from "../hooks/useAxios";

export const useSponsorshipAPI = () => {
  const axiosInstance = useAxios();

  const providerOffer = async (Data) => {
    const res = await axiosInstance.post("Sponsorship/provider/offer", Data);
    return res;
  };

  const offersSummary = async () => {
    const res = await axiosInstance.get("Sponsorship/provider/offers/summary");
    return res.data;
  };

  const offersBYStat = async (id, params) => {
    console.log(id);
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

  const providerOffers = async () => {
    const res = await axiosInstance.get("Sponsorship/provider/offers");
    return res.data;
  };

  const providerCancelDeal = async (Id) => {
    const res = await axiosInstance.put(`Sponsorship/provider/cancel/${Id}`);
    return res;
  };

  const providerCancelOffer = async (Id) => {
    const res = await axiosInstance.delete(`Sponsorship/provider/offer/${Id}`);
    return res;
  };

  return {
    providerOffer,
    offersSummary,
    offersBYStat,
    sponsoredDoctors,
    providerAcceptCounter,
    providerCancelDeal,
    providerRejectCounter,
    providerOffers,
    providerAcceptCounter,
    providerRejectCounter,
    providerCancelOffer,
  };
};
