import pickBy from "lodash/pickBy";
import { useQuery } from "react-query";
import { fetchPagesTotals } from "../../api/pages-totals";

export const usePagesTotals = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options;

  return useQuery(
    ["pagesTotals", pickBy(params)],
    () => fetchPagesTotals(params),
    {
      refetchInterval,
      staleTime,
    }
  );
};

export default usePagesTotals;
