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

  const offersBYStat = async (id) => {
    const res = await axiosInstance.get(
      `Sponsorship/provider/offers/by-status/${id}`,
    );
    return res.data;
  };

  return { providerOffer, offersSummary, offersBYStat };
};
