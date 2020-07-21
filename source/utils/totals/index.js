import find from 'lodash/find'
import get from 'lodash/get'
import { getPrimaryUnit, measurementDomains } from '../tags'

export const deserializeTotals = (totals, currency = 'GBP') =>
  measurementDomains
    .map(
      measurementDomain =>
        find(totals, { measurementDomain }) || { measurementDomain }
    )
    .reduce((acc, { measurementDomain, amounts = [] }) => {
      const label = measurementDomain.split(':')[0]
      const unit = getPrimaryUnit(measurementDomain)
      const value = get(find(amounts, { unit }), 'value', 0)

      switch (measurementDomain) {
        case 'fundraising:donations_received':
          return {
            ...acc,
            raised: get(
              find(amounts, { unit: currency.toLowerCase() }),
              'value',
              0
            )
          }

        case 'fundraising:donations_made':
          return {
            ...acc,
            donations: value
          }

        case 'any:activities':
          return {
            ...acc,
            fitnessCount: value
          }

        case 'walk:activities':
        case 'ride:activities':
        case 'swim:activities':
        case 'hike:activities':
          return {
            ...acc,
            [`${label}Count`]: value
          }

        case 'any:distance':
          return {
            ...acc,
            distance: value
          }

        case 'walk:distance':
        case 'ride:distance':
        case 'swim:distance':
        case 'hike:distance':
          return {
            ...acc,
            [`${label}Distance`]: value
          }

        case 'any:elapsed_time':
          return {
            ...acc,
            duration: value
          }

        case 'walk:elapsed_time':
        case 'ride:elapsed_time':
        case 'swim:elapsed_time':
        case 'hike:elapsed_time':
          return {
            ...acc,
            [`${label}Duration`]: value
          }

        case 'any:elevation_gain':
          return {
            ...acc,
            elevation: value
          }

        case 'walk:elevation_gain':
        case 'ride:elevation_gain':
        case 'swim:elevation_gain':
        case 'hike:elevation_gain':
          return {
            ...acc,
            [`${label}Elevation`]: value
          }

        default:
          return acc
      }
    }, {})
