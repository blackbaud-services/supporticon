import pickBy from 'lodash/pickBy';
import { useQuery } from 'react-query';

import { deserializeDonationTotals, fetchDonationTotals } from '../../api/donation-totals';

export const useDonationTotals = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options;

  return useQuery(
    ['donationTotals', pickBy(params)],
    () => fetchDonationTotals(params).then(deserializeDonationTotals),
    {
      refetchInterval,
      staleTime,
    }
  );
};

export default useDonationTotals;
