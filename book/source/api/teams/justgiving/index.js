import get from 'lodash/get'
import slugify from 'slugify'
import * as client from '../../../utils/client'
import { fetchPage, deserializePage } from '../../pages'
import { required } from '../../../utils/params'
import { parseText } from '../../../utils/justgiving'

export const deserializeTeam = team => {
  const subdomain = client.isStaging() ? 'www.staging' : 'www'
  const members = get(team, 'membership.members', [])

  return {
    active: team.status === 'active',
    campaign: get(team, 'campaign.title'),
    campaignId: get(team, 'campaign.campaignGuid'),
    charity: get(team, 'charity.name'),
    charityId: get(team, 'charity.charityId'),
    event: team.eventId,
    id: team.teamGuid,
    image: `https://images${subdomain.replace('www', '')}.jg-cdn.com/image/${
      team.coverPhotoImageId
    }?template=CrowdfundingOwnerAvatar`,
    leader: get(team, 'captain.userGuid'),
    members: members.map(
      member =>
        member.pageId
          ? deserializePage(member)
          : {
            id: member.fundraisingPageGuid,
            name: member.fundraisingPageName,
            slug: member.fundraisingPageShortName,
            status: member.fundraisingPageStatus,
            url: `https://${subdomain}.justgiving.com/fundraising/${
              team.fundraisingPageShortName
            }`,
            userId: member.userGuid
          }
    ),
    name: team.name,
    owner: get(team, 'captain.userGuid'),
    pages: members.map(page => page.fundraisingPageGuid || page.pageGuid),
    raised: get(team, 'donationSummary.totalAmount'),
    slug: team.shortName,
    story: parseText(team.story),
    target: get(team, 'fundraisingConfiguration.targetAmount'),
    url: `https://${subdomain}.justgiving.com/team/${team.shortName}`,
    uuid: team.teamGuid
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

export const fetchTeamBySlug = (slug = required(), options = {}) => {
  return client
    .get(`/campaigns/v1/teams/by-short-name/${slug}/full`)
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

  return Promise.all([
    updateTeamName(id, name, headers),
    story && updateTeamStory(id, story, headers),
    target && updateTeamTarget(id, target, currency, headers)
  ]).then(() => ({ success: true }))
}

const updateTeamName = (teamGuid, name, headers) => {
  const payload = { name, teamGuid }
  return client.put(`/campaigns/v1/teams/${teamGuid}/details/name`, payload, {
    headers
  })
}

const updateTeamStory = (teamGuid, rawStory, headers) => {
  const story = `[{"type":"paragraph","nodes":[{"type":"text","ranges":[{"text":"${rawStory}"}]}]}]`
  const payload = { teamGuid, story }
  return client.put(`/campaigns/v1/teams/${teamGuid}/details`, payload, {
    headers
  })
}

const updateTeamTarget = (teamGuid, targetAmount, currencyCode, headers) => {
  const payload = { teamGuid, targetAmount, currencyCode }
  return client.put(`/campaigns/v1/teams/${teamGuid}/fundraising`, payload, {
    headers
  })
}
