import { isJustGiving } from '../../utils/client'
import { required } from '../../utils/params'

import {
  fetchCampaigns as fetchJGCampaigns,
  fetchCampaign as fetchJGCampaign,
  fetchCampaignGroups as fetchJGCampaignGroups,
  deserializeCampaign as deserializeJGCampaign
} from './justgiving'

import {
  fetchCampaigns as fetchEDHCampaigns,
  fetchCampaign as fetchEDHCampaign,
  fetchCampaignGroups as fetchEDHCampaignGroups,
  deserializeCampaign as deserializeEDHCampaign
} from './everydayhero'

export const fetchCampaigns = (params = required()) => {
  return isJustGiving() ? fetchJGCampaigns(params) : fetchEDHCampaigns(params)
}

export const fetchCampaign = (id = required()) => {
  return isJustGiving() ? fetchJGCampaign(id) : fetchEDHCampaign(id)
}

export const fetchCampaignGroups = (id = required()) => {
  return isJustGiving() ? fetchJGCampaignGroups(id) : fetchEDHCampaignGroups(id)
}

export const deserializeCampaign = campaign => {
  return isJustGiving()
    ? deserializeJGCampaign(campaign)
    : deserializeEDHCampaign(campaign)
}
