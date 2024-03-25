import pickBy from "lodash/pickBy";
import { useQuery } from "@tanstack/react-query";
import {
  fetchLeaderboard,
  deserializeLeaderboard,
} from "../../api/leaderboard";

export const useLeaderboard = (params, options) => {
  const { deserializeMethod, refetchInterval, staleTime = 30000 } = options;

  return useQuery({
    queryKey: ["fundraisingLeaderboard", pickBy(params)],
    queryFn: () =>
      fetchLeaderboard(params).then((results) =>
        results.map(deserializeMethod || deserializeLeaderboard)
      ),
    options: { refetchInterval, staleTime },
  });
};

export default useLeaderboard;
