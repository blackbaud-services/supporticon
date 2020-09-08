import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'
import { fetchFitnessTotals } from '../../api/fitness-totals'
import { formatDuration } from '../../utils/fitness'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

class TotalDuration extends Component {
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
    const { activity, campaign, startDate, endDate } = this.props

    fetchFitnessTotals({
      campaign,
      startDate,
      endDate,
      types: activity
    })
      .then(totals =>
        this.setState({ status: 'fetched', data: totals.duration })
      )
      .catch(error => {
        this.setState({ status: 'failed' })
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
        amountLabel={this.renderAmountLabel()}
        {...metric}
      />
    )
  }

  renderAmount () {
    const { status, data } = this.state
    const { format, multiplier, offset, units } = this.props
    const amount = (offset + data) * multiplier

    switch (status) {
      case 'fetching':
        return <Loading />
      case 'failed':
        return <Icon name='warning' />
      default:
        return units ? formatDuration(amount) : numbro(amount).format(format)
    }
  }

  renderAmountLabel () {
    const { status, data } = this.state
    const { format, multiplier, offset, units } = this.props
    const amount = (offset + data) * multiplier

    switch (status) {
      case 'fetching':
        return 'Loading'
      case 'failed':
        return 'Error'
      default:
        return units
          ? formatDuration(amount, 'full')
          : numbro(amount).format(format)
    }
  }
}

TotalDuration.propTypes = {
  /**
   * The campaign uid/s to fetch totals for
   */
  campaign: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * The type of activity to get kms for
   * e.g. bike, [bike, run, walk, swim]
   */
  activity: PropTypes.oneOf([PropTypes.string, PropTypes.array]),

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
   * Include time units?
   */
  units: PropTypes.bool,

  /**
   * Start date filter (ISO Format)
   */
  startDate: PropTypes.string,

  /**
   * End date filter (ISO Format)
   */
  endDate: PropTypes.string,

  /**
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number
}

TotalDuration.defaultProps = {
  format: '0,0',
  label: 'Total Duration',
  multiplier: 1,
  offset: 0,
  units: true
}

export default TotalDuration
