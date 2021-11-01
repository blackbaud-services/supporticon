import { useQuery } from 'react-query'
import { fetchFitnessTotals } from '../../api/fitness-totals'

export const useFitnessTotals = (params, options = {}) =>
  useQuery(
    ['fitnessTotals', params],
    () => fetchFitnessTotals(params),
    options
  )

export default useFitnessTotals
