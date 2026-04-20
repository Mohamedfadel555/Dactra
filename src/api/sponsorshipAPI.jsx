import { useAxios } from "../hooks/useAxios";

export const useSponsorshipAPI = () => {
  const axiosInstance = useAxios();

  const providerOffer = (Data) => {
    const res = axiosInstance.post("Sponsorship/provider/offer", Data);
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

  const providerCancelOffer = async (Id) => {
    const res = await axiosInstance.put(`Sponsorship/provider/cancel/${Id}`);
    return res;
  };

  const providerOffers = async () => {
    const res = await axiosInstance.get("Sponsorship/provider/offers");
    return res.data;
  };

  return {
    providerOffer,
    offersSummary,
    offersBYStat,
    sponsoredDoctors,
    providerAcceptCounter,
    providerCancelOffer,
    providerRejectCounter,
    providerOffers,
  };
};
