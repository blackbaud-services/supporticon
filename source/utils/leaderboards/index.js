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
  type = 'campaign'
}) => {
  const definitionId = [type, snakeCase(measurementDomain), id].join('_')
  const segment = ['page', type, id].join(':')
  const primaryUnit = getPrimaryUnit(measurementDomain)

  return client
    .post(`/v1/tags/leaderboard/definition/${definitionId}`, {
      conditions,
      id: definitionId,
      measurementDomain,
      primaryUnit,
      segment,
      tagDefinition: {
        id: segment,
        label
      }
    })
    .then(data => data.definition)
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
