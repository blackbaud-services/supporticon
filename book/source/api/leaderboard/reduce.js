import { createReducer } from '../../utils/reducers'
import c from './constants'

export const deserializeLeaderboard = ({ page, team }, index) => {
  const detail = team || page
  return {
    position: index++,
    id: detail.id,
    name: detail.name,
    charity: detail.charity_name,
    url: detail.url,
    image: detail.image.medium_image_url,
    raised: detail.amount.cents,
    groups: detail.group_values
  }
}

export const leaderboardReducer = (options = {}) => {
  const {
    namespace = c.NAMESPACE,
    deserialize = deserializeLeaderboard,
    ...remainingOptions
  } = options

  return createReducer({
    namespace,
    deserialize,
    ...remainingOptions
  })
}
