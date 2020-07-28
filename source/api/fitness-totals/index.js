import { isJustGiving } from '../../utils/client'

import {
  fetchFitnessSummary as fetchEDHFitnessSummary,
  fetchFitnessTotals as fetchEDHFitnessTotals
} from './everydayhero'

import {
  fetchFitnessSummary as fetchJGFitnessSummary,
  fetchFitnessTotals as fetchJGFitnessTotals
} from './justgiving'

export const fetchFitnessSummary = (campaign, types) =>
  isJustGiving()
    ? fetchJGFitnessSummary(campaign, types)
    : fetchEDHFitnessSummary(campaign, types)

export const fetchFitnessTotals = (...args) =>
  isJustGiving()
    ? fetchJGFitnessTotals(...args)
    : fetchEDHFitnessTotals(...args)
