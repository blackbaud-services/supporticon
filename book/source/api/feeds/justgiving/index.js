import { get } from '../../../utils/client'
import { getShortName, getUID } from '../../../utils/params'
import jsonDate from '../../../utils/jsonDate'

export const fetchDonationFeed = ({ campaign, charity, page, donationRef }) => {
  if (charity) {
    return fetchDonationFeedForCharity(charity)
  }

  if (campaign) {
    return fetchDonationFeedForCampaign(campaign)
  }

  if (page) {
    return fetchDonationFeedForPage(page)
  }

  if (donationRef) {
    return fetchDonationFeedByRef(donationRef)
  }

  return Promise.reject(
    'You must pass a charity UID, page shortName, campaign GUID or donationRef for this method'
  )
}

const fetchDonationFeedForPage = page =>
  get(`v1/fundraising/pages/${getShortName(page)}/donations?pageSize=150`).then(
    data => data.donations
  )

const fetchDonationFeedForCharity = charity =>
  get(`v1/charity/${getUID(charity)}/donations`).then(data => data.donations)

const fetchDonationFeedForCampaign = campaign =>
  get(
    `donations/v1/donations?take=100&externalref=campaignGuid:${getUID(
      campaign
    )}`
  ).then(data => data.results)

const fetchDonationFeedByRef = ref =>
  get(`v1/donation/ref/${ref}`).then(data => data.donations)

export const deserializeDonation = donation => {
  const isFromDonationsAPI = !!donation.donationId

  return {
    amount: parseFloat(
      donation.donorLocalAmount ||
        donation.amount ||
        donation.donationAmount ||
        0
    ),
    anonymous: isFromDonationsAPI
      ? !donation.donor
      : !donation.donorDisplayName ||
        donation.donorDisplayName.toLowerCase().trim() === 'anonymous',
    charity: donation.charityId,
    createdAt: donation.donationDate
      ? jsonDate(donation.donationDate)
      : jsonDate(donation.date),
    currency: donation.donorLocalCurrencyCode || donation.currencyCode,
    donationRef: donation.thirdPartyReference,
    message: donation.message || donation.donorMessage,
    name: isFromDonationsAPI
      ? donation.donor && donation.donor.name
      : donation.donorDisplayName,
    page: donation.pageShortName
  }
}
