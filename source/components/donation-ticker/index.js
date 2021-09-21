import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { formatCurrency } from '../../utils/numbers'
import { fetchDonationFeed, deserializeDonation } from '../../api/feeds'

import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'
import Ticker from 'constructicon/ticker'

class DonationTicker extends Component {
  constructor () {
    super()
    this.fetchData = this.fetchData.bind(this)
    this.formatDonation = this.formatDonation.bind(this)
    this.state = {
      donations: [],
      status: 'fetching'
    }
  }

  componentDidMount () {
    const { refreshInterval } = this.props
    this.fetchData()
    this.interval =
      refreshInterval && setInterval(this.fetchData, refreshInterval)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  fetchData () {
    const {
      campaign,
      charity,
      donationRef,
      event,
      fetchAll,
      includeOffline,
      layout,
      limit,
      page,
      sort,
      team
    } = this.props

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
      .then(donations => donations.map(deserializeDonation))
      .then(donations =>
        donations.filter(donation => {
          if (donation.anonymous) return false
          if (layout.indexOf('amount') > -1) return !!donation.amount
          if (layout.indexOf('message') > -1) return !!donation.message
          if (layout.indexOf('name') > -1) return !!donation.name
          return true
        })
      )
      .then(donations =>
        donations.map(donation => this.formatDonation(donation))
      )
      .then(donations => this.setState({ donations, status: 'fetched' }))
      .catch(() => this.setState({ status: 'failed' }))
  }

  formatDonation (donation) {
    const { layout } = this.props
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
        return <span>{[donation.name, donation.message].join(' - ')}</span>
      case 'message-amount':
        return (
          <span>
            {donation.message} <strong>{formattedAmount}</strong>
          </span>
        )
      case 'name-message-amount':
        return (
          <span>
            {[donation.name, donation.message].join(' - ')}{' '}
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

  render () {
    const { label, ticker } = this.props
    const { donations, status } = this.state

    if (status === 'fetched') {
      return <Ticker label={label} items={donations} {...ticker} />
    }
    if (status === 'failed') {
      return <Metric icon='warning' label='An error occurred' />
    }
    return <Loading />
  }
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
