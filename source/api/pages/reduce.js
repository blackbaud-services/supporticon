import { createReducer } from '../../utils/reducers'
import c from './constants'

export const deserializePage = (page) => ({
  id: page.id,
  active: page.active,
  raised: page.amount.cents,
  campaign: page.campaign,
  charity: page.charity,
  expired: page.expired,
  image: page.image.medium_image_url,
  name: page.name,
  target: page.target_cents,
  url: page.url
})

export const pagesReducer = (options = {}) => {
  const {
    namespace = c.NAMESPACE,
    deserialize = deserializePage,
    ...remainingOptions
  } = options

  return createReducer({
    namespace,
    deserialize,
    ...remainingOptions
  })
}
