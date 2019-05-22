import { get, isStaging } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchCampaigns = () =>
  Promise.reject(new Error('This is method is not supported for JustGiving'))

export const fetchCampaign = (id = required()) =>
  get(`/campaigns/v2/campaign/${id}`)

export const fetchCampaignGroups = (id = required()) =>
  Promise.reject(new Error('This method is not supported for JustGiving'))

export const deserializeCampaign = campaign => {
  const subdomain = isStaging() ? 'www.staging' : 'www'

  return {
    name: campaign.title,
    summary: campaign.summary,
    id: campaign.campaignGuid,
    eventId: campaign.eventId,
    slug: campaign.shortName,
    target: campaign.targetAmount,
    raised: campaign.donationSummary.totalAmount,
    raisedOffline: campaign.donationSummary.offlineAmount,
    totalDonations: campaign.donationSummary.totalNumberOfDonations,
    getStartedUrl: `https://${subdomain}.justgiving.com/fundraising-page/creation?campaignGuid=${
      campaign.campaignGuid
    }`,
    donateUrl: null
  }
}
