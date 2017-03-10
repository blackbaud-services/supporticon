import fetch from '../../utils/fetch'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/pages',
  NAMESPACE: 'app/pages-totals'
}

export const fetchPagesTotals = (params = required()) => {
  const finalParams = {
    ...params,
    page: 1,
    limit: 1
  }

  const mappings = { type: 'type' }

  return fetch(c.ENDPOINT, finalParams, { mappings }).then((results) => results.meta.count)
}
