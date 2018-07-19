import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'
import { fetchPagesTotals } from '../../api/pages-totals'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

class TotalSupporters extends Component {
  constructor () {
    super()
    this.state = { status: 'fetching' }
  }

  componentDidMount () {
    const {
      campaign,
      charity,
      event,
      country,
      type,
      group,
      startDate,
      endDate,
      search
    } = this.props

    fetchPagesTotals({
      campaign,
      charity,
      event,
      country,
      type,
      group,
      startDate,
      endDate,
      search
    })
      .then((data) => {
        this.setState({
          status: 'fetched',
          data
        })
      })
      .catch((error) => {
        this.setState({
          status: 'failed'
        })
        return Promise.reject(error)
      })
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
      data = {}
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
        return numbro((offset + data) * multiplier).format(format)
    }
  }
}

TotalSupporters.propTypes = {
  /**
  * The campaign uid to fetch totals for
  */
  campaign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),

  /**
  * The charity uid to fetch totals for
  */
  charity: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),

  /**
  * Country code for API (JG only)
  */
  country: PropTypes.oneOf([ 'au', 'nz', 'uk', 'us', 'ie' ]),

  /**
  * The type of page to include in the leaderboard
  */
  type: PropTypes.oneOf([ 'individual', 'team', 'all' ]),

  /**
  * The group value(s) to filter by
  */
  group: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),

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
  * Use `v2/search/pages` endpoint (EDH only)
  */
  search: PropTypes.bool
}

TotalSupporters.defaultProps = {
  label: 'Supporters',
  offset: 0,
  multiplier: 1,
  format: '0,0',
  type: 'individual'
}

export default TotalSupporters
