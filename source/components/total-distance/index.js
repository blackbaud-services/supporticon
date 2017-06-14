import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'
import Icon from 'constructicon/icon'
import Metric from 'constructicon/metric'
import { fetchCampaign, fetchCampaigns } from '../../api/campaigns'

class TotalDistance extends Component {
  constructor () {
    super()
    this.state = { status: 'fetching' }
  }

  componentDidMount () {
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
        this.setState({
          status: 'failed'
        })
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
        this.setState({
          status: 'failed'
        })
        return Promise.reject(error)
      })
    }
  }

  calculateTotal (data) {
    const { activity } = this.props
    switch (typeof activity) {
      case 'string':
        return data.fitness_activity_overview[activity].distance_in_meters
      case 'object':
        return activity.reduce((total, type) => (
          total += data.fitness_activity_overview[type].distance_in_meters
        ), 0)
      default:
        return Object.keys(data.fitness_activity_overview).reduce((total, type) => (
          total += data.fitness_activity_overview[type].distance_in_meters
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

    switch (status) {
      case 'fetching':
        return <Icon name='loading' spin />
      case 'failed':
        return <Icon name='warning' />
      default:
        return `${numbro((this.props.offset + data) / 1000).format('0,0')}km`
    }
  }
}

TotalDistance.propTypes = {
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
  metric: PropTypes.object
}

TotalDistance.defaultProps = {
  label: 'Total Distance',
  offset: 0
}

export default TotalDistance
