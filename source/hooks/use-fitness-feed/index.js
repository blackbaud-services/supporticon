import { useQuery } from 'react-query'
import {
  fetchFitnessActivities,
  deserializeFitnessActivity
} from '../../api/fitness-activities'

export const useFitnessFeed = (params, options = {}) => {
  return useQuery(
    ['fitnessFeeds', params],
    () =>
      fetchFitnessActivities(params)
        .then(data => data.map(deserializeFitnessActivity)),
    {
      placeholderData: [],
      ...options
    }
  )
}

export default useFitnessFeed
