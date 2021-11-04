import pickBy from 'lodash/pickBy'
import { useQuery } from 'react-query'
import {
  fetchFitnessLeaderboard,
  deserializeFitnessLeaderboard
} from '../../api/fitness-leaderboard'

export const useFitnessLeaderboard = (params, options) => {
  const { deserializeMethod, refetchInterval } = options

  return useQuery(
    ['fitnessLeaderboard', pickBy(params)],
    () =>
      fetchFitnessLeaderboard(params)
        .then(results => results.map(deserializeMethod || deserializeFitnessLeaderboard)),
    {
      placeholderData: [],
      refetchInterval
    }
  )
}

export default useFitnessLeaderboard
