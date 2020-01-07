import { get, put } from '../../../utils/client'
import { required } from '../../../utils/params'

export const deserializeTeam = team => ({
  id: team.teamGuid,
  leader: team.captain.userGuid,
  name: team.name,
  pages: team.membership.members,
  raised: team.donationSummary.totalAmount,
  slug: team.shortName
})

export const fetchTeams = () => {
  return Promise.reject(
    new Error('This method is not supported for JustGiving')
  )
}

export const fetchTeam = (id = required()) => {
  return get(`v1/teams/${id}/full`)
}

export const createTeam = ({
  authType = 'Basic',
  name = required(),
  slug = required(),
  story = required(),
  target = required(),
  targetType = 'Fixed',
  teamType = 'Open',
  token = required()
}) => {
  return put(
    'v1/team',
    {
      name,
      story,
      targetType,
      teamShortName: slug,
      teamTarget: target,
      teamType
    },
    {
      headers: {
        Authorization: [authType, token].join(' ')
      }
    }
  )
}

export const joinTeam = ({
  authType = 'Basic',
  id = required(),
  page = required(),
  token = required()
}) => {
  return put(
    `v1/team/join/${id}`,
    {
      pageShortName: page
    },
    {
      headers: {
        Authorization: [authType, token].join(' ')
      }
    }
  )
}
