import fetch from '../../utils/fetch'
import { createAction } from '../../utils/actions'
import { required } from '../../utils/params'
import c from './constants'

export const fetchLeaderboard = (params = required()) => {
  const transforms = {
    type: (val) => val === 'team' ? 'teams' : 'individuals'
  }

  return fetch(c.ENDPOINT, params, { transforms })
    .then((response) => response.results)
}

export const fetchLeaderboardAction = (params, options = {}) => {
  const {
    namespace = c.NAMESPACE,
    ...remainingOptions
  } = options

  return createAction({
    fetcher: fetchLeaderboard,
    params,
    namespace,
    options: remainingOptions
  })
}
