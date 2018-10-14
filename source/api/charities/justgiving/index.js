import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const c = {
  SEARCH_ENDPOINT: 'v1/onesearch'
}

export const searchCharities = (params = required()) => {
  const finalParams = {
    ...params,
    i: 'Charity'
  }

  return get(c.SEARCH_ENDPOINT, finalParams)
    .then(response => (
      (response.GroupedResults &&
      response.GroupedResults.length &&
      response.GroupedResults[0].Results) || []
    ))
}
