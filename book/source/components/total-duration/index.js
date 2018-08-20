import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'
import { fetchCampaign, fetchCampaigns } from '../../api/campaigns'

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
    this.interval = refreshInterval && setInterval(this.fetchData, refreshInterval)
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  fetchData () {
    const { campaign } = this.props

    if (Array.isArray(campaign)) {
      fetchCampaigns({ ids: campaign }).then((data) => {
        let total = 0
        data.map((campaign) => {
          total += this.calculateTotal(campaign)
        })

        this.setState({
          status: 'fetched',
          data: total
        })
      })
      .catch((error) => {
        this.setState({ status: 'failed' })
        return Promise.reject(error)
      })
    } else {
      fetchCampaign(campaign).then((data) => {
        this.setState({
          status: 'fetched',
          data: this.calculateTotal(data)
        })
      })
      .catch((error) => {
        this.setState({ status: 'failed' })
        return Promise.reject(error)
      })
    }
  }

  calculateTotal (data) {
    const { activity } = this.props
    switch (typeof activity) {
      case 'string':
        return data.fitness_activity_overview[activity].duration_in_seconds
      case 'object':
        return activity.reduce((total, type) => (
          total += data.fitness_activity_overview[type].duration_in_seconds
        ), 0)
      default:
        return Object.keys(data.fitness_activity_overview).reduce((total, type) => (
          total += data.fitness_activity_overview[type].duration_in_seconds
        ), 0)
    }
  }

  render () {
    const {
      icon,
      label,
      metric
    } = this.props

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
    const {
      status,
      data
    } = this.state

    const {
      format,
      offset,
      multiplier
    } = this.props

    switch (status) {
      case 'fetching':
        return <Loading />
      case 'failed':
        return <Icon name='warning' />
      default:
        return numbro((offset + data) / 3600 * multiplier).format(format)
    }
  }
}

TotalDuration.propTypes = {
  /**
  * The campaign uid/s to fetch totals for
  */
  campaign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),

  /**
  * The type of activity to get kms for
  * e.g. bike, [bike, run, walk, swim]
  */
  activity: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.array
  ]),

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

TotalDuration.defaultProps = {
  label: 'Total Duration',
  offset: 0,
  multiplier: 1,
  format: '0,0'
}

export default TotalDuration
