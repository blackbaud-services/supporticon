import { get, servicesAPI } from '../../../utils/client'
import { getUID } from '../../../utils/params'
import jsonDate from '../../../utils/jsonDate'

export const fetchDonationFeed = ({
  campaign,
  charity,
  event,
  page,
  pageShortName,
  donationRef
}) => {
  if (donationRef) {
    return fetchDonationFeedByRef(donationRef)
  }

  if (pageShortName) {
    return fetchDonationsByShortName(pageShortName)
  }

  if (charity || campaign || event || page) {
    return fetchDonations({ charity, campaign, event, page }).then(
      data => data.results
    )
  }

  return Promise.reject(
    'You must pass a charity UID, event ID, page ID, page short name, campaign GUID or donationRef for this method'
  )
}

const mapValue = v => (Array.isArray(v) ? v.map(getUID).join(',') : getUID(v))

export const fetchDonations = ({ event, charity, campaign, page }) =>
  servicesAPI
    .get('/v1/justgiving/donations', {
      params: {
        campaignGuid: mapValue(campaign),
        charityId: mapValue(charity),
        eventId: mapValue(event),
        fundraisingPageId: mapValue(page)
      }
    })
    .then(response => response.data)

const fetchDonationFeedByRef = ref =>
  get(`v1/donation/ref/${ref}`).then(data => data.donations)

const fetchDonationsByShortName = pageShortName =>
  get(`v1/fundraising/pages/${pageShortName}/donations`).then(
    data => data.donations
  )

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
    id: donation.id,
    message: donation.message || donation.donorMessage,
    name: isFromDonationsAPI
      ? donation.donor && donation.donor.name
      : donation.donorDisplayName,
    page: donation.pageShortName,
    status: donation.status
  }
}
