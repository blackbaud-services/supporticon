import pickBy from "lodash/pickBy";
import { useQuery } from "@tanstack/react-query";
import {
  fetchFitnessLeaderboard,
  deserializeFitnessLeaderboard,
} from "../../api/fitness-leaderboard";

export const useFitnessLeaderboard = (params, options) => {
  const { deserializeMethod, refetchInterval, staleTime = 30000 } = options;

  return useQuery({
    queryKey: ["fitnessLeaderboard", pickBy(params)],
    queryFn: () =>
      fetchFitnessLeaderboard(params).then((results) =>
        results.map(deserializeMethod || deserializeFitnessLeaderboard)
      ),
    options: { refetchInterval, staleTime },
  });
};

export default useFitnessLeaderboard;
