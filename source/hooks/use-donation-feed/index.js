import pickBy from "lodash/pickBy";
import { useQuery } from "@tanstack/react-query";
import { fetchDonationFeed, deserializeDonation } from "../../api/feeds";

export const useDonationFeed = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options;

  return useQuery({
    queryKey: ["donationFeed", pickBy(params)],
    queryFn: () =>
      fetchDonationFeed(params).then((data) => data.map(deserializeDonation)),
    options: { refetchInterval, staleTime },
  });
};

export default useDonationFeed;
