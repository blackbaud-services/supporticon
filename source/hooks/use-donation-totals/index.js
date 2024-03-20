import { useQuery } from "@tanstack/react-query";
import pickBy from "lodash/pickBy";
import {
  fetchDonationTotals,
  deserializeDonationTotals,
} from "../../api/donation-totals";

export const useDonationTotals = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options;

  return useQuery({
    queryKey: ["donationTotals", pickBy(params)],
    queryFn: () => fetchDonationTotals(params).then(deserializeDonationTotals),
    options: { refetchInterval, staleTime },
  });
};

export default useDonationTotals;
