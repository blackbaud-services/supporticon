import { useQuery } from "@tanstack/react-query";
import { fetchDonation, deserializeDonation } from "../../api/donations";

export const useDonation = (donationId, options = {}) => {
  const {
    deserializeMethod = deserializeDonation,
    initialData,
    refetchInterval,
    staleTime = 30000,
  } = options;

  return useQuery({
    queryKey: ["donation", donationId],
    queryFn: () => fetchDonation(donationId).then(deserializeMethod),
    options: {
      enabled: !!donationId,
      initialData,
      refetchInterval,
      staleTime,
    },
  });
};

export default useDonation;
