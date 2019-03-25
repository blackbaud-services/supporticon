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

export const fetchCampaign = (id = required()) => {
  if (typeof id === 'object') {
    const { countryCode = required(), slug = required() } = id

    return get([c.ENDPOINT, countryCode, slug].join('/')).then(
      response => response.campaign
    )
  }

  return get(`${c.ENDPOINT}/${id}`).then(response => response.campaign)
}

export const fetchCampaignGroups = (id = required()) =>
  get(`${c.ENDPOINT}/${id}/groups`).then(response => response.campaign_groups)

export const deserializeCampaign = campaign => ({
  name: campaign.name,
  summary: campaign.description,
  id: campaign.id,
  uuid: campaign.uuid,
  slug: campaign.slug,
  url: campaign.url,
  target: null,
  raised: campaign.funds_raised.cents / 100,
  raisedOffline: null,
  totalDonations: null,
  getStartedUrl: campaign.get_started_url,
  donateUrl: campaign.donate_url
})
