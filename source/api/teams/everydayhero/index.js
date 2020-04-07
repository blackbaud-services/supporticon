import get from 'lodash/get'
import * as client from '../../../utils/client'
import { fetchPage, fetchPages } from '../../pages'
import { required } from '../../../utils/params'

export const deserializeTeam = team => ({
  active: team.active || team.state === 'active',
  campaign: team.campaign_name,
  campaignId: team.campaign_uid,
  charity: team.charity_name,
  charityId: team.charity_uid,
  id: team.id,
  fitnessGoal: team.fitness_goal,
  image: team.image && team.image.large_image_url,
  leader: team.team_leader_page_uid,
  members: get(team, 'members', []).map(member => ({
    userId: member.owner_uid,
    image: get(member, 'image.large_image_url'),
    id: member.id,
    name: member.name,
    slug: member.slug,
    status: member.status
  })),
  name: team.name,
  owner: team.owner_uid,
  pages: team.team_member_uids,
  raised: get(team, 'amount.cents') / 100,
  slug: team.slug,
  story: team.story,
  target: team.target_cents / 100,
  url: team.url,
  uuid: team.uuid
})

export const fetchTeams = args =>
  fetchPages({ type: 'team', allPages: true, ...args })

export const fetchTeam = (id = required()) => {
  return client.get(`api/v2/pages/${id}`).then(response => response.page)
}

export const fetchTeamBySlug = (params = required()) => {
  return fetchPage(params)
    .then(team => fetchPage(team.id))
    .then(team => {
      const ids = team.team_member_uids
      return fetchPages({ ids, allPages: true }).then(members => ({
        ...team,
        members
      }))
    })
}

export const createTeam = ({ token = required(), page = required(), name }) => {
  const payload = {
    individual_page_id: page,
    name
  }

  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  return client
    .post('api/v2/teams', payload, options)
    .then(response => response.page)
}

export const joinTeam = ({
  id = required(),
  page = required(),
  token = required()
}) => {
  const payload = {
    individual_page_id: page
  }

  const options = {
    headers: {
      Authorization: `Bearer ${token}`
    }
  }

  return client
    .post(`api/v2/teams/${id}/join-requests`, payload, options)
    .then(response => response.team)
}
