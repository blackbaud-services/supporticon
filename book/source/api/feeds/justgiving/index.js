import qs from 'query-string'
import { get, servicesAPI } from '../../../utils/client'
import { getUID } from '../../../utils/params'
import jsonDate from '../../../utils/jsonDate'

export const fetchDonationFeed = ({
  campaign,
  charity,
  event,
  page,
  donationRef
}) => {
  if (donationRef) {
    return fetchDonationFeedByRef(donationRef)
  }

  if (charity || campaign || event || page) {
    return fetchDonations({ charity, campaign, event, page }).then(
      data => data.results
    )
  }

  return Promise.reject(
    'You must pass a charity UID, event ID, page ID, campaign GUID or donationRef for this method'
  )
}

const mapValue = v => (Array.isArray(v) ? v.map(getUID) : getUID(v))

export const fetchDonations = ({ event, charity, campaign, page }) =>
  servicesAPI
    .get('/v1/justgiving/donations', {
      params: {
        campaignGuid: mapValue(campaign),
        charityId: mapValue(charity),
        eventId: mapValue(event),
        fundraisingPageId: mapValue(page)
      },
      paramsSerializer: params => qs.stringify(params, { arrayFormat: 'comma' })
    })
    .then(response => response.data)

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