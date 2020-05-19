import get from 'lodash/get'
import find from 'lodash/find'
import slugify from 'slugify'
import { v4 as uuid } from 'uuid'
import * as client from '../../../utils/client'
import { fetchPage, deserializePage } from '../../pages'
import { paramsSerializer, required } from '../../../utils/params'
import { baseUrl, imageUrl, parseText } from '../../../utils/justgiving'

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

export const fetchTeams = (options = required()) => {
  const { campaign = required(), limit = 100 } = options

  const params = {
    CampaignGuid: campaign,
    Take: limit
  }

  return client.servicesAPI
    .get('/v1/justgiving/proxy/campaigns/v1/teams/search', {
      params,
      paramsSerializer
    })
    .then(response => response.data.results)
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

export const checkTeamSlugAvailable = (slug = required()) =>
  fetchTeamBySlug(slug)
    .then(() => Promise.resolve([slug, uuid()].join('-')))
    .catch(() => Promise.resolve(slug))

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
    name,
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

  return checkTeamSlugAvailable(payload.teamShortName)
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
  const prepareStory = story =>
    `[{"type":"paragraph","nodes":[{"type":"text","ranges":[{"text":"${story}"}]}]}]`
  const update = (url, payload) =>
    client.put(
      `/campaigns/v1/teams/${id}/${url}`,
      { teamGuid: id, ...payload },
      { headers }
    )

  return Promise.all(
    [
      name && update('details/name', { name }),
      (story || image) &&
        update('details', {
          coverPhotoImageId: image,
          story: prepareStory(story)
        }),
      target &&
        update('fundraising', { targetAmount: target, currencyCode: currency })
    ].filter(Boolean)
  )
}
