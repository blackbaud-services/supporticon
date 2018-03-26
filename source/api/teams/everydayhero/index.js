import { get, post } from '../../../utils/client'
import { required } from '../../../utils/params'

export const deserializeTeam = (team) => ({
  id: team.id,
  leader: team.leader_id,
  name: team.name,
  pages: team.page_ids,
  raised: null,
  slug: null
})

export const fetchTeams = ({
  token = required()
}) => {
  return get('api/v2/teams', {}, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then((response) => response.teams)
}

export const fetchTeam = ({
  id = required(),
  token = required()
}) => {
  return get(`api/v2/teams/${id}`, {}, {}, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then((response) => response.team)
}

export const createTeam = ({
  token = required(),
  page = required(),
  name
}) => {
  return post('api/v2/teams', {
    individual_page_id: page,
    name
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then((response) => response.page)
}

export const joinTeam = ({
  id = required(),
  page = required(),
  token = required()
}) => {
  return post(`api/v2/teams/${id}/join-requests`, {
    individual_page_id: page
  }, {
    headers: {
      'Authorization': `Bearer ${token}`
    }
  })
  .then((response) => response.team)
}
