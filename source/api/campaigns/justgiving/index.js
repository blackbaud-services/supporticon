import { get } from '../../../utils/client'
import { required } from '../../../utils/params'

export const fetchCampaigns = () =>
  Promise.reject(new Error('This is method is not supported for JustGiving'))

export const fetchCampaign = (id = required()) =>
  get(`/campaigns/v2/campaign/${id}`)

export const fetchCampaignGroups = (id = required()) =>
  Promise.reject(new Error('This method is not supported for JustGiving'))

export const deserializeCampaign = campaign => {
  return {
    name: campaign.title,
    summary: campaign.summary,
    id: campaign.campaignGuid,
    slug: campaign.shortName,
    target: campaign.targetAmount,
    raised: campaign.donationSummary.totalAmount,
    raisedOffline: campaign.donationSummary.offlineAmount,
    totalDonations: campaign.donationSummary.totalNumberOfDonations,
    getStartedUrl: null,
    donateUrl: null
  }
}
