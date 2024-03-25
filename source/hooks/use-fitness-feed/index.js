import { useQuery } from "@tanstack/react-query";
import {
  fetchFitnessActivities,
  deserializeFitnessActivity,
} from "../../api/fitness-activities";

export const useFitnessFeed = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options;

  return useQuery({
    queryKey: ["fitnessFeeds", params],
    queryFn: () =>
      fetchFitnessActivities(params).then((data) =>
        data.map(deserializeFitnessActivity)
      ),
    options: { refetchInterval, staleTime },
  });
};

export default useFitnessFeed;
