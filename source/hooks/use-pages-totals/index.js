import pickBy from 'lodash/pickBy'
import { useQuery } from 'react-query'
import { fetchPagesTotals } from '../../api/pages-totals'

export const usePagesTotals = (params, options = {}) =>
  useQuery(
    ['pagesTotals', pickBy(params)],
    () => fetchPagesTotals(params),
    options
  )

export default usePagesTotals
