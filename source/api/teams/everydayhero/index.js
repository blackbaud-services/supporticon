import get from 'lodash/get'
import * as client from '../../../utils/client'
import { fetchPages } from '../../pages'
import { required } from '../../../utils/params'

export const deserializeTeam = team => ({
  id: team.id,
  leader: team.team_leader_page_uid,
  name: team.name,
  owner: team.owner_uid,
  pages: team.team_member_uids,
  raised: get(team, 'amount.cents'),
  slug: team.slug,
  url: team.url
})

export const fetchTeams = args =>
  fetchPages({ type: 'team', allPages: true, ...args })

export const fetchTeam = (id = required()) => {
  return client.get(`api/v2/pages/${id}`).then(response => response.page)
}

export const createTeam = ({ token = required(), page = required(), name }) => {
  return client
    .post(
      'api/v2/teams',
      {
        individual_page_id: page,
        name
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(response => response.page)
}

export const joinTeam = ({
  id = required(),
  page = required(),
  token = required()
}) => {
  return client
    .post(
      `api/v2/teams/${id}/join-requests`,
      {
        individual_page_id: page
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
    .then(response => response.team)
}
