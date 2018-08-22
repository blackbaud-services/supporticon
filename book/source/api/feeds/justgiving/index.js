import moment from 'moment'
import { get } from '../../../utils/client'
import { getShortName, getUID } from '../../../utils/params'

export const fetchDonationFeed = ({ charity, page }) => {
  if (!charity && !page) {
    return Promise.reject('You must pass a charity UID or page shortName for this method')
  }

  const url = charity
    ? `v1/charity/${getUID(charity)}/donations`
    : `v1/fundraising/pages/${getShortName(page)}/donations?pageSize=150`

  return get(url).then((response) => response.donations)
}

export const deserializeDonation = (donation) => ({
  amount: donation.donorLocalAmount || donation.amount,
  anonymous: !donation.donorDisplayName || donation.donorDisplayName.toLowerCase().trim() === 'anonymous',
  createdAt: moment.isMoment(moment(donation.donationDate)) && moment(donation.donationDate).toISOString(),
  currency: donation.donorLocalCurrencyCode || donation.currencyCode,
  message: donation.message,
  name: donation.donorDisplayName
})
