import { get } from '../../../utils/client'
import { getShortName, getUID } from '../../../utils/params'
import jsonDate from '../../../utils/jsonDate'

export const fetchDonationFeed = ({ charity, page, donationRef }) => {
  if (!charity && !page && !donationRef) {
    return Promise.reject(
      'You must pass a charity UID, page shortName or donationRef for this method'
    )
  }

  const url = page
    ? `v1/fundraising/pages/${getShortName(page)}/donations?pageSize=150`
    : donationRef
      ? `v1/donation/ref/${donationRef}`
      : `v1/charity/${getUID(charity)}/donations`

  return get(url).then(response => response.donations)
}

export const deserializeDonation = donation => ({
  amount: parseFloat(donation.donorLocalAmount || donation.amount || 0),
  anonymous:
    !donation.donorDisplayName ||
    donation.donorDisplayName.toLowerCase().trim() === 'anonymous',
  charity: donation.charityId,
  createdAt: jsonDate(donation.donationDate),
  currency: donation.donorLocalCurrencyCode || donation.currencyCode,
  donationRef: donation.thirdPartyReference,
  message: donation.message,
  name: donation.donorDisplayName,
  page: donation.pageShortName
})
