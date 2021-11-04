import { useQuery } from 'react-query'
import { fetchPagesTotals } from '../../api/pages-totals'

export const usePagesTotals = (params, options = {}) =>
  useQuery(
    ['pagesTotals', params],
    () => fetchPagesTotals(params),
    options
  )

export default usePagesTotals
