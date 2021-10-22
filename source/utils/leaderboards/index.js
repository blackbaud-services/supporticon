import flatten from 'lodash/flatten'
import get from 'lodash/get'
import kebabCase from 'lodash/kebabCase'
import orderBy from 'lodash/orderBy'
import * as client from '../client'
import { required } from '../params'
import { getPrimaryUnit, measurementDomains } from '../tags'
import { hash } from 'spark-md5'

export const getShortMeasurementDomain = (domain = 'any:distance') => {
  switch (domain) {
    case 'fundraising:donations_made':
      return 'fc'
    case 'any:elapsed_time':
    case 'hike:elapsed_time':
    case 'ride:elapsed_time':
    case 'swim:elapsed_time':
    case 'walk:elapsed_time':
      return [domain.charAt(0), 't'].join('')
    default:
      return domain
        .split(':')
        .map(substring => substring.charAt(0))
        .join('')
  }
}

const genId = ({
  id = required(),
  measurementDomain = 'any:distance',
  name,
  tagId,
  type = 'campaign'
}) => {
  return hash(
    [type, getShortMeasurementDomain(measurementDomain), id, tagId, name]
      .filter(Boolean)
      .map(kebabCase)
      .join('-')
  )
}

export const generateLeaderboardId = genId

export const fetchLeaderboardDefinition = ({
  id = required(),
  measurementDomain = 'any:distance',
  name,
  tagId,
  type = 'campaign'
}) => {
  const definitionId = genId({ id, measurementDomain, name, tagId, type })

  return client
    .get(`/v1/tags/leaderboard/definition/${definitionId}`)
    .then(data => data.definition)
}

export const fetchLeaderboardDefinitions = params =>
  Promise.all(
    measurementDomains.map(measurementDomain =>
      fetchLeaderboardDefinition({ ...params, measurementDomain })
    )
  )

export const createLeaderboardDefinition = ({
  id = required(),
  conditions = [],
  label = 'Page Campaign Link',
  measurementDomain = 'any:distance',
  name,
  tagId,
  type = 'campaign'
}) => {
  const segment = ['page', type, id].join(':')
  const primaryUnit = getPrimaryUnit(measurementDomain)
  const definitionId = genId({ id, measurementDomain, name, tagId, type })

  const payload = {
    conditions,
    id: definitionId,
    measurementDomain,
    primaryUnit,
    segment,
    tagDefinition: {
      id: tagId || segment,
      label
    }
  }

  return client
    .post(`/v1/tags/leaderboard/definition/${definitionId}`, payload)
    .then(data => ({ ...data.definition, updated: true }))
    .catch(({ data = {} }) => {
      const errorMessage = data.errorMessage

      if (errorMessage && errorMessage.indexOf('already has totals') > -1) {
        return Promise.resolve({
          ...payload,
          updated: false
        })
      }

      return Promise.reject(data)
    })
}

export const createLeaderboardDefinitions = params =>
  Promise.all(
    measurementDomains.map(measurementDomain =>
      createLeaderboardDefinition({ ...params, measurementDomain })
    )
  )

export const deleteLeaderboardDefinition = ({
  id = required(),
  measurementDomain = 'any:distance',
  name,
  tagId,
  type = 'campaign'
}) => {
  const definitionId = genId({ id, measurementDomain, name, tagId, type })

  return client.destroy(`/v1/tags/leaderboard/definition/${definitionId}`)
}

export const deleteLeaderboardDefinitions = params =>
  Promise.all(
    measurementDomains.map(measurementDomain =>
      deleteLeaderboardDefinition({ ...params, measurementDomain })
    )
  )

export const fetchLeaderboard = ({
  id = required(),
  activityType = 'fundraising',
  limit = 10,
  sortBy = 'donations_received',
  tagId,
  tagValue,
  type = 'campaign'
}) => {
  if (id.split(',').length > 1) {
    return Promise.all(
      id.split(',').map(idx =>
        fetchLeaderboard({
          id: idx,
          activityType,
          limit,
          sortBy,
          tagId,
          tagValue,
          type
        })
      )
    )
      .then(flatten)
      .then(results =>
        orderBy(results, [item => get(item, 'amounts[0].value', 0)], ['desc'])
      )
  }

  const leaderboardId = genId({
    id,
    measurementDomain: [activityType, sortBy].join(':'),
    name: tagValue,
    tagId,
    type
  })

  const query = `
    {
      leaderboard(
        id: "${leaderboardId}"
      ) {
        totals(limit: ${limit}) {
          tagValue
          tagValueAsNode {
            ... on Page {
              slug
              title
              summary
              status
              legacyId
              url
              owner {
                name
              }
              donationSummary {
                donationCount
                offlineAmount {
                  value
                  currencyCode
                }
                totalAmount {
                  value
                  currencyCode
                }
              }
              targetWithCurrency {
                value
                currencyCode
              }
              heroMedia {
                ... on ImageMedia {
                  url
                }
              }
            }
          }
          amounts {
            value
            unit
          }
        }
      }
    }
  `

  return client.servicesAPI
    .post('/v1/justgiving/graphql', { query })
    .then(response => response.data)
    .then(result => get(result, 'data.leaderboard.totals', []))
    .then(results => results.map(item => ({ ...item, ...item.tagValueAsNode })))
}
