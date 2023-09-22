import pickBy from 'lodash/pickBy';
import { useQuery } from 'react-query';

import { fetchFitnessTotals } from '../../api/fitness-totals';

export const useFitnessTotals = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options;

  return useQuery(['fitnessTotals', pickBy(params)], () => fetchFitnessTotals(params), {
    refetchInterval,
    staleTime,
  });
};

export default useFitnessTotals;
