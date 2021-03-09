import get from 'lodash/get'
import find from 'lodash/find'
import slugify from 'slugify'
import * as client from '../../../utils/client'
import { fetchPage, deserializePage } from '../../pages'
import { paramsSerializer, required } from '../../../utils/params'
import { baseUrl, imageUrl, parseText } from '../../../utils/justgiving'

export const teamNameRegex = /[^\w\s'"!?£$€¥.,-]/gi

export const deserializeTeam = team => {
  const members = get(team, 'membership.members', [])
  const membersFitness = get(team, 'fitness.pages', [])

  return {
    active: team.status === 'active',
    campaign: get(team, 'campaign.title'),
    campaignId: get(team, 'campaign.campaignGuid'),
    charity: get(team, 'charity.name'),
    charityId: get(team, 'charity.charityId'),
    event: team.eventId,
    fitnessDistanceTotal: get(team, 'fitness.totalAmount', 0),
    fitnessDurationTotal: get(team, 'fitness.totalAmountTaken', 0),
    id: team.teamGuid,
    image: imageUrl(team.coverPhotoImageId || team.coverImageName),
    leader: [
      get(team, 'captain.firstName'),
      get(team, 'captain.lastName')
    ].join(' '),
    members: members.map(member => {
      const page = member.pageId
        ? deserializePage(member)
        : {
          id: member.fundraisingPageGuid,
          name: member.fundraisingPageName,
          slug: member.fundraisingPageShortName,
          status: member.fundraisingPageStatus,
          url: `${baseUrl()}/fundraising/${team.fundraisingPageShortName}`,
          userId: member.userGuid,
          uuid: member.fundraisingPageGuid
        }

      const pageFitness = find(membersFitness, p => p.ID === page.uuid) || {}

      return {
        ...page,
        fitnessDistanceTotal: pageFitness.TotalValue || 0
      }
    }),
    name: team.name,
    owner: get(team, 'captain.userGuid'),
    pages: members.map(page => page.fundraisingPageGuid || page.pageGuid),
    raised: get(team, 'donationSummary.totalAmount'),
    slug: team.shortName,
    story: parseText(team.story),
    target: get(team, 'fundraisingConfiguration.targetAmount'),
    url: `${baseUrl()}/team/${team.shortName}`,
    uuid: team.teamGuid
  }
}

const recursivelyFetchTeams = ({
  CampaignGuid,
  Take,
  offset = 0,
  results = []
}) => {
  const params = {
    CampaignGuid,
    Take,
    offset
  }
  return client.servicesAPI
    .get('/v1/justgiving/proxy/campaigns/v1/teams/search', {
      params,
      paramsSerializer
    })
    .then(response => response.data)
    .then(data => {
      const { next } = data
      const offset = next && next.split('offset=')[1]
      const updatedResults = [...results, ...data.results]
      if (offset) {
        return recursivelyFetchTeams({
          CampaignGuid,
          Take,
          offset,
          results: updatedResults
        })
      } else {
        return updatedResults
      }
    })
}

export const fetchTeams = (options = required()) => {
  const { allTeams, campaign = required(), limit = 100 } = options

  const params = {
    CampaignGuid: campaign,
    Take: limit
  }
  if (allTeams) {
    return recursivelyFetchTeams(params)
  } else {
    return client.servicesAPI
      .get('/v1/justgiving/proxy/campaigns/v1/teams/search', {
        params,
        paramsSerializer
      })
      .then(response => response.data.results)
  }
}

export const fetchTeam = (id = required()) => {
  return client.servicesAPI
    .get(`/v1/justgiving/proxy/campaigns/v1/teams/${id}/full`)
    .then(response => response.data)
}

export const fetchTeamBySlug = (slug = required(), options = {}) => {
  return client.servicesAPI
    .get(`/v1/justgiving/proxy/campaigns/v1/teams/by-short-name/${slug}/full`)
    .then(response => response.data)
    .then(team => {
      if (options.includeFitness) {
        return client
          .get(`v1/fitness/teams/${team.teamGuid}`)
          .then(fitness => ({ ...team, fitness }))
      }

      return team
    })
    .then(team => {
      if (options.includePages) {
        return Promise.all(
          team.membership.members.map(page =>
            fetchPage(page.fundraisingPageShortName)
          )
        ).then(members => ({
          ...team,
          membership: { ...team.membership, members }
        }))
      }

      return Promise.resolve(team)
    })
}

export const checkTeamSlugAvailable = (
  slug = required(),
  { authType = 'Bearer', token = required() }
) => {
  const options = {
    headers: {
      Authorization: `${authType} ${token}`,
      'x-api-key': client.instance.defaults.headers['x-api-key']
    }
  }

  return client.servicesAPI
    .get(
      `/v1/justgiving/proxy/campaigns/v1/teams/shortNames/${slug}/isAvailable`,
      options
    )
    .then(response => response.data.isAvailable)
    .then(isAvailable => (isAvailable ? slug : appendIdToSlug(slug)))
    .catch(() => appendIdToSlug(slug))
}

// Take an existing slug
// Trim it down it size so it does not exceed to limit of 50
// Append a small generated unique id
const appendIdToSlug = slug => {
  const trimmedSlug = slug.slice(0, 43)
  const randomId = Math.random()
    .toString(36)
    .slice(-6)

  return `${trimmedSlug}-${randomId}`
}

export const createTeam = params => {
  const {
    authType = 'Bearer',
    name = required(),
    campaignId = required(),
    story = required(),
    captainSlug = required(),
    coverPhotoId,
    slug,
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
    name: name
      .replace(/’/g, "'")
      .replace(teamNameRegex, '')
      .substring(0, 255),
    story,
    targetCurrency,
    targetType,
    teamShortName: slug || slugify(params.name, { lower: true, strict: true }),
    teamTarget: target,
    teamType
  }

  const options = {
    headers: {
      Authorization: `${authType} ${token}`
    }
  }

  return checkTeamSlugAvailable(payload.teamShortName, { authType, token })
    .then(teamShortName =>
      client.put('/v2/teams', { ...payload, teamShortName }, options)
    )
    .then(
      res =>
        res.errorMessage ? Promise.reject(new Error(res.errorMessage)) : res
    )
    .then(res => fetchTeam(res.teamGuid))
}

export const joinTeam = ({
  authType = 'Bearer',
  pageId = required(),
  pageSlug = required(),
  teamId = required(),
  teamSlug = required(),
  token = required()
}) => {
  if (authType === 'Basic') {
    throw new Error('Teams does not support basic authentication')
  }

  const payload = {
    pageId,
    pageSlug,
    teamId,
    teamSlug
  }

  const options = {
    headers: {
      Authorization: `${authType} ${token}`
    }
  }

  return client.servicesAPI
    .post('/v1/justgiving/teams/join', payload, options)
    .then(response => response.data)
}

export const updateTeam = (
  id = required(),
  {
    name = required(),
    token = required(),
    currency = 'GBP',
    image,
    target,
    story
  }
) => {
  const headers = { Authorization: `Bearer ${token}` }

  const payload = {
    teamGuid: id,
    coverPhotoId: image,
    currency,
    name: name.replace(teamNameRegex, '').substring(0, 255),
    story,
    targetAmount: target
  }

  return client.put(`/v1/teamsv2/${id}`, payload, { headers })
}
