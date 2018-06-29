import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchPagesTotals = ({ search, ...params } = required()) => {
  const finalParams = {
    ...params,
    page: 1,
    limit: 1
  }

  const mappings = {
    type: 'type',
    startDate: 'start_updated_at',
    endDate: 'end_updated_at'
  }

  const transforms = {
    type: type => {
      switch (type) {
        case 'individual':
          return search ? 'user' : 'individual'
        default:
          return type
      }
    }
  }

  const url = search ? 'api/v2/search/pages' : 'api/v2/pages'

  return get(url, finalParams, { mappings, transforms }).then(
    ({ meta }) => (search ? meta.pagination.count : meta.count)
  )
}
