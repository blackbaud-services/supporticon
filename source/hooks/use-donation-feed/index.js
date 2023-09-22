import pickBy from 'lodash/pickBy';
import { useQuery } from 'react-query';

import { deserializeDonation, fetchDonationFeed } from '../../api/feeds';

export const useDonationFeed = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options;

  return useQuery(
    ['donationFeed', pickBy(params)],
    () => fetchDonationFeed(params).then((data) => data.map(deserializeDonation)),
    {
      refetchInterval,
      staleTime,
    }
  );
};

export default useDonationFeed;
