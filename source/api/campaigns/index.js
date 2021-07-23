import get from 'lodash/get'
import { servicesAPI } from '../../utils/client'
import { baseUrl, imageUrl, parseText } from '../../utils/justgiving'
import { required } from '../../utils/params'

export const fetchCampaigns = ({ ids = required() }) => {
  return Promise.resolve()
    .then(() => (Array.isArray(ids) ? ids : ids.split(',')))
    .then(ids => Promise.all(ids.map(fetchCampaign)))
}

export const fetchCampaign = (id = required()) =>
  servicesAPI
    .get(`/v1/justgiving/campaigns/${id}`)
    .then(response => response.data)

export const deserializeCampaign = campaign => ({
  charities: campaign.charities,
  donateUrl: [
    baseUrl('link'),
    'v1/campaign/donate/campaignGuid',
    campaign.campaignGuid
  ].join('/'),
  eventId: campaign.eventId,
  getStartedUrl: `${baseUrl()}/fundraising-page/creation?campaignGuid=${
    campaign.campaignGuid
  }`,
  id: campaign.campaignGuid,
  name: campaign.title,
  image: imageUrl(get(campaign, 'heroImage.imageName')),
  raised: campaign.donationSummary.totalAmount,
  raisedOffline: campaign.donationSummary.offlineAmount,
  slug: campaign.shortName,
  story: parseText(campaign.story),
  summary: campaign.summary,
  target: campaign.targetAmount,
  totalDonations: campaign.donationSummary.totalNumberOfDonations,
  url: `${baseUrl()}/campaign/${campaign.shortName}`
})
