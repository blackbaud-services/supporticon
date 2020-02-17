import get from 'lodash/get'
import slugify from 'slugify'
import * as client from '../../../utils/client'
import { required } from '../../../utils/params'

export const deserializeTeam = team => {
  const subdomain = client.isStaging() ? 'www.staging' : 'www'

  return {
    id: team.teamGuid,
    leader: get(team, 'captain.firstName'),
    name: team.name,
    pages: team.numberOfSupporters,
    raised: get(team, 'donationSummary.totalAmount'),
    slug: team.shortName,
    url: `https://${subdomain}.justgiving.com/team/${team.shortName}`
  }
}

export const fetchTeams = (options = required()) => {
  const { campaign = required(), limit = 100 } = options

  const params = {
    CampaignGuid: campaign,
    Take: limit
  }

  return client
    .get('campaigns/v1/teams/search', params)
    .then(data => data.results)
}

export const fetchTeam = (id = required()) => {
  return client.get(`/campaigns/v1/teams/${id}/full`)
}

export const createTeam = params => {
  const {
    authType = 'Bearer',
    name = required(),
    campaignId = required(),
    story = required(),
    captainSlug = required(),
    coverPhotoId,
    target = 1000,
    targetType = 'Fixed',
    targetCurrency = 'GBP',
    teamType = 'Open',
    token = required()
  } = params

  if (authType === 'Basic') {
    throw new Error('Teams does not support basic authentication')
  }

  const payload = {
    campaignGuid: campaignId,
    captainPageShortName: captainSlug,
    coverPhotoId,
    name,
    story,
    targetCurrency,
    targetType,
    teamShortName: slugify(params.name),
    teamTarget: target,
    teamType
  }

  const options = {
    headers: {
      Authorization: `${authType} ${token}`
    }
  }

  return client
    .put('/v2/teams', payload, options)
    .then(
      res =>
        res.errorMessage ? Promise.reject(new Error(res.errorMessage)) : res
    )
    .then(res => fetchTeam(res.teamGuid))
}

export const joinTeam = ({
  authType = 'Bearer',
  pageSlug = required(),
  teamSlug = required(),
  token = required()
}) => {
  if (authType === 'Basic') {
    throw new Error('Teams does not support basic authentication')
  }

  const payload = {
    pageShortName: pageSlug
  }

  const options = {
    headers: {
      Authorization: `${authType} ${token}`
    }
  }

  return client
    .put(`/v2/teams/join/${teamSlug}`, payload, options)
    .then(
      res =>
        res.errorMessage ? Promise.reject(new Error(res.errorMessage)) : res
    )
}
