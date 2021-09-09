import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

import {
  fetchDonationTotals,
  deserializeDonationTotals
} from '../../api/donation-totals'

class TotalFundsRaised extends Component {
  constructor () {
    super()
    this.fetchData = this.fetchData.bind(this)
    this.state = { status: 'fetching' }
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
      excludeOffline,
      country,
      startDate,
      endDate
    } = this.props

    fetchDonationTotals({
      campaign,
      charity,
      donationRef,
      event,
      country,
      includeOffline: !excludeOffline,
      startDate,
      endDate
    })
      .then(data => {
        this.setState({
          status: 'fetched',
          data: deserializeDonationTotals(data, excludeOffline)
        })
      })
      .catch(error => {
        this.setState({
          status: 'failed'
        })
        return Promise.reject(error)
      })
  }

  render () {
    const { icon, label, metric } = this.props

    return (
      <Metric
        icon={icon}
        label={label}
        amount={this.renderAmount()}
        {...metric}
      />
    )
  }

  renderAmount () {
    const { status, data = {} } = this.state
    const { currency, format, offset, multiplier } = this.props
    const formatMethod = currency ? 'formatCurrency' : 'format'

    switch (status) {
      case 'fetching':
        return <Loading />
      case 'failed':
        return <Icon name='warning' />
      default:
        return numbro((offset + data.raised) * multiplier)[formatMethod](format)
    }
  }
}

TotalFundsRaised.propTypes = {
  /**
   * The campaign uid to fetch totals for
   */
  campaign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The event uid to fetch totals for
   */
  event: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The charity uid to fetch totals for
   */
  charity: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The donation ref to fetch totals for
   */
  donationRef: PropTypes.string,

  /**
   * Country code for API
   */
  country: PropTypes.oneOf([
    'au',
    'ca',
    'gb',
    'hk',
    'ie',
    'nz',
    'sg',
    'uk',
    'us',
    'za'
  ]),

  /**
   * Format as currency?
   */
  currency: PropTypes.bool,

  /**
   * Exclude offline donations?
   */
  excludeOffline: PropTypes.bool,

  /**
   * Start date filter (ISO Format)
   */
  startDate: PropTypes.string,

  /**
   * End date filter (ISO Format)
   */
  endDate: PropTypes.string,

  /**
   * Offset
   */
  offset: PropTypes.number,

  /**
   * The amount to multiply the total by for custom conversions
   */
  multiplier: PropTypes.number,

  /**
   * The label of the metric
   */
  label: PropTypes.string,

  /**
   * The format of the number
   */
  format: PropTypes.string,

  /**
   * The icon to use
   * - String representing a constructicon icon e.g. heart
   * - Array of custom paths
   * - An element to use instead e.g. <i className='fa fa-heart' />
   */
  icon: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.element
  ]),

  /**
   * Props to be passed to the Constructicon Metric component
   */
  metric: PropTypes.object,

  /**
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number
}

TotalFundsRaised.defaultProps = {
  currency: true,
  excludeOffline: false,
  format: '0,0',
  label: 'Funds Raised',
  multiplier: 1,
  offset: 0
}

export default TotalFundsRaised
