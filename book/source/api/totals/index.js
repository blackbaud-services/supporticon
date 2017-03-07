import fetch from '../../utils/fetch'
import { required } from '../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/search/totals',
  NAMESPACE: 'app/totals'
}

export const deserializeTotals = (totals) => totals

export const fetchTotals = (params = required()) => {
  return fetch(c.ENDPOINT, params)
}
