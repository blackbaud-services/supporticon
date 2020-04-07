import { isJustGiving } from '../../utils/client'

import {
  deserializeTeam as deserializeJGTeam,
  fetchTeams as fetchJGTeams,
  fetchTeam as fetchJGTeam,
  fetchTeamBySlug as fetchJGTeamBySlug,
  createTeam as createJGTeam,
  joinTeam as joinJGTeam
} from './justgiving'

import {
  deserializeTeam as deserializeEDHTeam,
  fetchTeams as fetchEDHTeams,
  fetchTeam as fetchEDHTeam,
  fetchTeamBySlug as fetchEDHTeamBySlug,
  createTeam as createEDHTeam,
  joinTeam as joinEDHTeam
} from './everydayhero'

export const deserializeTeam = team =>
  isJustGiving() ? deserializeJGTeam(team) : deserializeEDHTeam(team)

export const fetchTeams = params =>
  isJustGiving() ? fetchJGTeams(params) : fetchEDHTeams(params)

export const fetchTeam = params =>
  isJustGiving() ? fetchJGTeam(params) : fetchEDHTeam(params)

export const fetchTeamBySlug = params =>
  isJustGiving() ? fetchJGTeamBySlug(params) : fetchEDHTeamBySlug(params)

export const createTeam = params =>
  isJustGiving() ? createJGTeam(params) : createEDHTeam(params)

export const joinTeam = params =>
  isJustGiving() ? joinJGTeam(params) : joinEDHTeam(params)
