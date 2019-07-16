import { get } from '../../../utils/client'
import { required } from '../../../utils/params'
import jsonDate from '../../../utils/jsonDate'

export const fetchDonation = (id = required()) => get(`/v1/donation/${id}`)

export const replyToDonation = () =>
  Promise.reject(new Error('This method is not yet supported by JustGiving'))

export const deserializeDonation = donation => ({
  amount: parseFloat(donation.donorLocalAmount || donation.amount),
  anonymous:
    !donation.donorDisplayName ||
    donation.donorDisplayName.toLowerCase().trim() === 'anonymous',
  charity: donation.charityId,
  createdAt: jsonDate(donation.donationDate),
  currency: donation.donorLocalCurrencyCode || donation.currencyCode,
  donationRef: donation.donationRef,
  event: donation.eventId,
  message: donation.message,
  name: donation.donorDisplayName,
  page: donation.pageShortName,
  status: donation.status,
  id: donation.id
})
