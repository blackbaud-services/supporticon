import get from 'lodash/get'
import snakeCase from 'lodash/snakeCase'
import * as client from '../client'
import { required } from '../params'
import { getPrimaryUnit, measurementDomains } from '../tags'

export const fetchLeaderboardDefinition = ({
  id = required(),
  measurementDomain = 'any:distance',
  type = 'campaign'
}) => {
  const definitionId = [type, snakeCase(measurementDomain), id].join('_')

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
  const definitionId = [type, snakeCase(measurementDomain), id, tagId, name]
    .filter(Boolean)
    .join('_')

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
  type = 'campaign'
}) => {
  const definitionId = [type, snakeCase(measurementDomain), id].join('_')
  return client.destroy(`/v1/tags/leaderboard/definition/${definitionId}`)
}

export const deleteLeaderboardDefinitions = params =>
  Promise.all(
    measurementDomains.map(measurementDomain =>
      deleteLeaderboardDefinition({ ...params, measurementDomain })
    )
  )

export const fetchLeaderboard = ({
  campaign = required(),
  activityType = 'fundraising',
  limit = 10,
  sortBy = 'donations_received',
  tagId,
  tagValue,
  type = 'campaign'
}) => {
  const leaderboardId = [
    type,
    activityType,
    sortBy,
    campaign,
    snakeCase(tagId),
    snakeCase(tagValue)
  ]
    .filter(Boolean)
    .join('_')

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
