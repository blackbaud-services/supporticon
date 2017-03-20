import React, { Component, PropTypes } from 'react'
import numbro from 'numbro'
import Icon from 'constructicon/icon'
import Metric from 'constructicon/metric'
import { fetchPagesTotals } from '../../api/pages-totals'

class TotalSupporters extends Component {
  constructor () {
    super()
    this.state = { status: 'fetching' }
  }

  componentDidMount () {
    const {
      campaign,
      charity,
      type,
      group,
      startDate,
      endDate
    } = this.props

    fetchPagesTotals({
      campaign,
      charity,
      type,
      group,
      startDate,
      endDate
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

    switch (status) {
      case 'fetching':
        return <Icon name='loading' spin />
      case 'failed':
        return <Icon name='warning' />
      default:
        return numbro(this.props.offset + data).format('0,0')
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

TotalSupporters.defaultProps = {
  label: 'Supporters',
  offset: 0,
  type: 'individual'
}

export default TotalSupporters
