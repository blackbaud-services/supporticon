import { useQuery } from 'react-query'
import {
  fetchFitnessActivities,
  deserializeFitnessActivity
} from '../../api/fitness-activities'

export const useFitnessFeed = (params, options = {}) => {
  const { refetchInterval, staleTime = 30000 } = options

  return useQuery(
    ['fitnessFeeds', params],
    () =>
      fetchFitnessActivities(params)
        .then(data => data.map(deserializeFitnessActivity)),
    {
      refetchInterval,
      staleTime
    }
  )
}

export default useFitnessFeed
