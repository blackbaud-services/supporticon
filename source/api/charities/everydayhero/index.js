import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/charities',
  SEARCH_ENDPOINT: 'api/v2/search/charities'
}

export const searchCharities = (params = required()) => {
  return get(c.SEARCH_ENDPOINT, params)
    .then(response => response.charities)
}
