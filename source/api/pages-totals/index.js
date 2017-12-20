import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'
import { fetchPagesTotals as fetchJGPagesTotals } from './justgiving'
import { fetchPagesTotals as fetchEDHPagesTotals } from './everydayhero'

export const fetchPagesTotals = (params = required()) => {
  return isJustGiving()
    ? fetchJGPagesTotals(params)
    : fetchEDHPagesTotals(params)
}
