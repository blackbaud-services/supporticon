import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const c = {
  ENDPOINT: 'api/v2/campaigns'
}

export const fetchCampaigns = (params = required()) => {
  const mappings = {
    charity: 'charity_ids'
  }

  const transforms = {
    charity: v => (Array.isArray(v) ? v.join(',') : v)
  }

  return get(c.ENDPOINT, params, { mappings, transforms }).then(
    response => response.campaigns
  )
}

export const fetchCampaign = (id = required()) =>
  get(`${c.ENDPOINT}/${id}`).then(response => response.campaign)

export const fetchCampaignGroups = (id = required()) =>
  get(`${c.ENDPOINT}/${id}/groups`).then(response => response.campaign_groups)

export const deserializeCampaign = campaign => ({
  name: campaign.name,
  id: campaign.id,
  uuid: campaign.uuid,
  slug: campaign.slug,
  url: campaign.url,
  getStartedUrl: campaign.get_started_url,
  donateUrl: campaign.donate_url
})
