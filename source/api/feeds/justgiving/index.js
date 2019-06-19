import { get, servicesAPI } from '../../../utils/client'
import { getShortName, getUID } from '../../../utils/params'
import jsonDate from '../../../utils/jsonDate'

export const fetchDonationFeed = ({
  campaign,
  charity,
  event,
  page,
  donationRef
}) => {
  if (charity) {
    return fetchDonationFeedForCharity(charity)
  }

  if (event) {
    return fetchDonationFeedForEvent(event)
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

const fetchDonations = params =>
  servicesAPI
    .get('/v1/justgiving/donations', { params })
    .then(response => response.data)
    .then(data => data.results)

const fetchDonationFeedForCharity = charity =>
  fetchDonations({ charityId: getUID(charity) })

const fetchDonationFeedForEvent = event =>
  fetchDonations({ eventId: getUID(event) })

const fetchDonationFeedForCampaign = campaign =>
  fetchDonations({ campaignGuid: getUID(campaign) })

const fetchDonationFeedForPage = page =>
  get(`v1/fundraising/pages/${getShortName(page)}/donations?pageSize=150`).then(
    data => data.donations
  )

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
