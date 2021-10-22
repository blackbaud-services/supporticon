import React from 'react'
import PropTypes from 'prop-types'
import { formatCurrency } from '../../utils/numbers'
import { fetchDonationFeed, deserializeDonation } from '../../api/feeds'
import useAsync from '../../hooks/use-async'

import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'
import Ticker from 'constructicon/ticker'

const DonationTicker = ({
  campaign,
  charity,
  donationRef,
  event,
  fetchAll,
  includeOffline,
  label,
  layout,
  limit,
  page,
  refreshInterval,
  sort,
  team,
  ticker
}) => {
  const formatDonation = donation => {
    const formattedAmount = formatCurrency({
      amount: donation.amount,
      currencyCode: donation.currency
    })
    switch (layout) {
      case 'name-only':
        return donation.name
      case 'amount-only':
        return formattedAmount
      case 'message-only':
        return donation.message
      case 'name-message':
        return (
          <span>
            {[donation.name, donation.message].filter(Boolean).join(' - ')}
          </span>
        )
      case 'message-amount':
        return (
          <span>
            {donation.message} <strong>{formattedAmount}</strong>
          </span>
        )
      case 'name-message-amount':
        return (
          <span>
            {[donation.name, donation.message].filter(Boolean).join(' - ')}{' '}
            <strong>{formattedAmount}</strong>
          </span>
        )
      case 'amount-name':
        return (
          <span>
            <strong>{formattedAmount}</strong> {donation.name}
          </span>
        )
      default:
        return (
          <span>
            {donation.name} <strong>{formattedAmount}</strong>
          </span>
        )
    }
  }

  const fetchData = () =>
    Promise.resolve()
      .then(() =>
        fetchDonationFeed({
          campaign,
          charity,
          donationRef,
          event,
          fetchAll,
          includeOffline,
          limit,
          page,
          sort,
          team
        })
      )
      .then(response => response.map(deserializeDonation))
      .then(deserializeDonations => {
        const filteredDonations = deserializeDonations.filter(donation => {
          if (donation.anonymous) return false
          if (layout.indexOf('amount') > -1) return !!donation.amount
          if (layout.indexOf('message') > -1) return !!donation.message
          if (layout.indexOf('name') > -1) return !!donation.name
          return true
        })
        const donations = filteredDonations.map(donation =>
          formatDonation(donation)
        )
        return donations
      })

  const { status, data } = useAsync(fetchData, { refreshInterval })

  if (status === 'fetched' && data) {
    return <Ticker label={label} items={data} {...ticker} />
  }
  if (status === 'failed') {
    return <Metric icon='warning' label='An error occurred' amount={0} />
  }
  return <Loading />
}

DonationTicker.propTypes = {
  /**
   * The campaign uid to fetch feed for
   */
  campaign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The charity uid to fetch feed for
   */
  charity: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The donation ref to fetch feed for
   */
  donationRef: PropTypes.string,

  /**
   * The event id to fetch feed for
   */
  event: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The page uid to fetch feed for
   */
  page: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The team uid to fetch feed for
   */
  team: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * Recursively fetch all donations (up to 5000)
   */
  fetchAll: PropTypes.bool,

  /**
   * Donation display format
   */
  layout: PropTypes.oneOf([
    'amount-name',
    'name-amount',
    'name-message',
    'name-message-amount',
    'message-amount',
    'amount-only',
    'name-only',
    'message-only'
  ]),

  /**
   * Label text
   */
  label: PropTypes.string,

  /**
   * Limit of API requests to make
   */
  limit: PropTypes.number,

  /**
   * Include offline donations
   */
  includeOffline: PropTypes.bool,

  /**
   * Props to be passed to the Constructicon Ticker component
   */
  ticker: PropTypes.object,

  /**
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number
}

DonationTicker.defaultProps = {
  fetchAll: false,
  layout: 'name-amount',
  ticker: {}
}

export default DonationTicker
