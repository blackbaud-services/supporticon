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

class TotalDonations extends Component {
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
      event,
      excludeOffline,
      country,
      group,
      startDate,
      endDate
    } = this.props

    fetchDonationTotals({
      campaign,
      charity,
      event,
      country,
      group,
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

    const { format, offset, multiplier } = this.props

    switch (status) {
      case 'fetching':
        return <Loading />
      case 'failed':
        return <Icon name='warning' />
      default:
        return numbro((offset + data.donations) * multiplier).format(format)
    }
  }
}

TotalDonations.propTypes = {
  /**
   * The campaign uid to fetch totals for
   */
  campaign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The event uid to fetch totals for (JG only)
   */
  event: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The charity uid to fetch totals for
   */
  activity: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * Country code for API (JG only)
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
   * Exclude offline donations?
   */
  excludeOffline: PropTypes.bool,

  /**
   * The group value(s) to filter by
   */
  group: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

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
   * The format of the number
   */
  format: PropTypes.string,

  /**
   * The label of the metric
   */
  label: PropTypes.string,

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

TotalDonations.defaultProps = {
  excludeOffline: false,
  format: '0,0',
  label: 'Donations',
  multiplier: 1,
  offset: 0
}

export default TotalDonations
