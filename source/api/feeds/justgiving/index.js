import { get } from '../../../utils/client'
import { getShortName, getUID } from '../../../utils/params'
import jsonDate from '../../../utils/jsonDate'

export const fetchDonationFeed = ({ charity, page }) => {
  if (!charity && !page) {
    return Promise.reject('You must pass a charity UID or page shortName for this method')
  }

  const url = page
    ? `v1/fundraising/pages/${getShortName(page)}/donations?pageSize=150`
    : `v1/charity/${getUID(charity)}/donations`

  return get(url).then(response => response.donations)
}

export const deserializeDonation = donation => ({
  amount: donation.donorLocalAmount || donation.amount,
  anonymous: !donation.donorDisplayName || donation.donorDisplayName.toLowerCase().trim() === 'anonymous',
  createdAt: jsonDate(donation.donationDate),
  currency: donation.donorLocalCurrencyCode || donation.currencyCode,
  message: donation.message,
  name: donation.donorDisplayName
})
