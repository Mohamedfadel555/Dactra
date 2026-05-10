import { useQuery } from "@tanstack/react-query";
import { useSponsorshipAPI } from "../api/sponsorshipAPI";

export const useGetLabServices = (id) => {
  console.log(id);
  const { getLabServices } = useSponsorshipAPI();
  return useQuery({
    queryKey: ["labservices", id],
    queryFn: () => getLabServices(id),
    enabled: !!id,
    select: (data) =>
      data.map((item) => ({
        id: item.id,
        name: item.testService.name,
        description: item.testService.description,
        price: item.price,
        duration: item.duration,
      })),
  });
};
