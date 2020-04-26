import { isStaging, servicesAPI } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchCampaigns = ({ ids }) => {
  if (!ids) {
    return Promise.reject(
      new Error('This is method only supports an array of GUIDs for JustGiving')
    )
  }

  return Promise.resolve()
    .then(() => (Array.isArray(ids) ? ids : ids.split(',')))
    .then(ids => Promise.all(ids.map(fetchCampaign)))
}

export const fetchCampaign = (id = required()) =>
  servicesAPI
    .get(`/v1/justgiving/campaigns/${id}`)
    .then(response => response.data)

export const fetchCampaignGroups = (id = required()) =>
  Promise.reject(new Error('This method is not supported for JustGiving'))

export const deserializeCampaign = campaign => {
  const subdomain = isStaging() ? 'www.staging' : 'www'

  return {
    donateUrl: `http://${subdomain.replace(
      'www',
      'link'
    )}.justgiving.com/v1/campaign/donate/campaignGuid/${campaign.campaignGuid}`,
    eventId: campaign.eventId,
    getStartedUrl: `https://${subdomain}.justgiving.com/fundraising-page/creation?campaignGuid=${
      campaign.campaignGuid
    }`,
    id: campaign.campaignGuid,
    name: campaign.title,
    raised: campaign.donationSummary.totalAmount,
    raisedOffline: campaign.donationSummary.offlineAmount,
    slug: campaign.shortName,
    summary: campaign.summary,
    target: campaign.targetAmount,
    totalDonations: campaign.donationSummary.totalNumberOfDonations,
    url: `https://${subdomain}.justgiving.com/campaign/${campaign.shortName}`
  }
}