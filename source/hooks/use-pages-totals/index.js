import pickBy from "lodash/pickBy";
import { useQuery } from "@tanstack/react-query";
import { fetchPagesTotals } from "../../api/pages-totals";

export const usePagesTotals = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options;

  return useQuery({
    queryKey: ["pagesTotals", pickBy(params)],
    queryFn: () => fetchPagesTotals(params),
    options: { refetchInterval, staleTime },
  });
};

export default usePagesTotals;
