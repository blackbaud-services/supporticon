import pickBy from 'lodash/pickBy'
import { useQuery } from 'react-query'
import { fetchLeaderboard, deserializeLeaderboard } from '../../api/leaderboard'

export const useLeaderboard = (params, options) => {
  const { deserializeMethod, refetchInterval, staleTime = 30000 } = options

  return useQuery(
    ['fundraisingLeaderboard', pickBy(params)],
    () =>
      fetchLeaderboard(params)
        .then(results => results.map(deserializeMethod || deserializeLeaderboard)),
    {
      refetchInterval,
      staleTime
    }
  )
}

export default useLeaderboard
