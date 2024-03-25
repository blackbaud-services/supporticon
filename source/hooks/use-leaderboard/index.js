import { pickBy, sortBy } from 'lodash'
import { useQuery } from 'react-query'
import { fetchLeaderboard, deserializeLeaderboard } from '../../api/leaderboard'

export const useLeaderboard = (params, options) => {
  const { deserializeMethod, refetchInterval, staleTime = 30000 } = options

  return useQuery(
    ['fundraisingLeaderboard', pickBy(params)],
    () =>
      fetchLeaderboard(params)
        .then(results => results.map(deserializeMethod || deserializeLeaderboard))
        .then(results => {
          if (params.sortBy === 'donations_received') {
            return sortBy(results, (item) => item.raised).reverse()
          }
          return results
        }),
    {
      refetchInterval,
      staleTime
    }
  )
}

export default useLeaderboard
