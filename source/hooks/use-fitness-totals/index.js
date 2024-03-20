import pickBy from "lodash/pickBy";
import { useQuery } from "@tanstack/react-query";
import { fetchFitnessTotals } from "../../api/fitness-totals";

export const useFitnessTotals = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options;

  return useQuery({
    queryKey: ["fitnessTotals", pickBy(params)],
    queryFn: () => fetchFitnessTotals(params),
    options: { refetchInterval, staleTime },
  });
};

export default useFitnessTotals;
