import get from 'lodash/get'
import slugify from 'slugify'
import * as client from '../../../utils/client'
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
    leader: get(team, 'captain.firstName'),
    members: members.map(member => ({
      userId: member.userGuid,
      image: member.profileImage,
      id: member.fundraisingPageGuid,
      name: member.fundraisingPageName,
      slug: member.fundraisingPageShortName,
      status: member.fundraisingPageStatus
    })),
    name: team.name,
    owner: get(team, 'captain.userGuid'),
    pages: members.map(page => page.fundraisingPageGuid),
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

export const fetchTeamBySlug = (slug = required()) => {
  return client.get(`/campaigns/v1/teams/by-short-name/${slug}/full`)
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
