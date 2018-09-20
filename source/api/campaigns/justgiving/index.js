import { get } from '../../../utils/client'
import { getShortName, required } from '../../../utils/params'

export const c = {
  ENDPOINT: 'v1/campaigns'
}

export const fetchCampaigns = (params = required()) =>
  get(`${c.ENDPOINT}/${getShortName(params.charity)}`).then(
    response => response.campaignsDetails
  )

export const fetchCampaign = ({
  charity = required(),
  campaign = required()
}) => get(`${c.ENDPOINT}/${getShortName(charity)}/${getShortName(campaign)}`)

export const fetchCampaignGroups = (id = required()) =>
  Promise.reject('This method is not supported for JustGiving')

export const deserializeCampaign = campaign => {
  const { id, campaignUrl, causeId } = campaign
  const slug = campaignUrl.split('/')[campaignUrl.split('/').length - 1]

  return {
    name: campaign.campaignPageName,
    id,
    slug,
    url: campaignUrl,
    getStartedUrl: `https://www.justgiving.com/fundraising-page/creation/?cid=${id}&causeId=${causeId}`,
    donateUrl: `https://link.justgiving.com/v1/campaign/donate/campaignId/${id}`
  }
}
