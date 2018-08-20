import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import numbro from 'numbro'
import { fetchDonationTotals, deserializeDonationTotals } from '../../api/donation-totals'

import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import Heading from 'constructicon/heading'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'
import Progress from 'constructicon/progress-bar'

class ProgressBar extends Component {
  constructor () {
    super()
    this.calculatePercentage = this.calculatePercentage.bind(this)
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
    const {
      campaign,
      charity,
      country,
      endDate,
      event,
      excludeOffline,
      group,
      startDate
    } = this.props

    fetchDonationTotals({
      campaign,
      charity,
      country,
      endDate,
      event,
      group,
      startDate
    })
      .then(data => deserializeDonationTotals(data, excludeOffline))
      .then(data => this.setState({ status: 'fetched', raised: data.raised }))
      .catch(() => this.setState({ status: 'failed' }))
  }

  calculateDaysRemaining (eventDate) {
    const today = moment()
    const eventMoment = moment(eventDate)
    const daysDiff = Math.ceil(eventMoment.diff(today, 'days', true)) // we want to round up
    return Math.max(0, daysDiff)
  }

  calculatePercentage () {
    const { offset, target } = this.props
    const { raised = 0 } = this.state
    return Math.min(100, Math.floor((raised + offset) / target * 100))
  }

  render () {
    const {
      eventDate,
      format,
      fundedLabel,
      offset,
      progressBar,
      raisedLabel,
      remainingLabel,
      target,
      targetLabel
    } = this.props

    const {
      raised,
      status
    } = this.state

    return status === 'fetched' ? (
      <Grid spacing={0.25}>
        <GridColumn xs={6}>
          <Metric
            align='left'
            label={raisedLabel}
            amount={numbro(raised + offset).formatCurrency(format)}
          />
        </GridColumn>
        <GridColumn xs={6} xsAlign='right'>
          <Metric
            align='right'
            label={targetLabel}
            amount={numbro(target).formatCurrency(format)}
          />
        </GridColumn>
        <GridColumn>
          <Progress
            alt='<%= progress %>% there'
            progress={this.calculatePercentage()}
            {...progressBar}
          />
        </GridColumn>
        {fundedLabel && (
          <GridColumn xs={6}>
            <Heading size={0} tag='strong'>{this.calculatePercentage()}%</Heading> {fundedLabel}
          </GridColumn>
        )}
        {remainingLabel && eventDate && (
          <GridColumn xs={6} xsAlign='right'>
            <Heading size={0} tag='strong'>{this.calculateDaysRemaining(eventDate)}</Heading> {remainingLabel}
          </GridColumn>
        )}
      </Grid>
    ) : (
      <Loading />
    )
  }
}

ProgressBar.propTypes = {
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
  country: PropTypes.oneOf(['au', 'ca', 'hk', 'ie', 'nz', 'sg', 'uk', 'us', 'za']),

  /**
  * Exclude offline donations?
  */
  excludeOffline: PropTypes.bool,

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
  * Target
  */
  target: PropTypes.number.isRequired,

  /**
  * Raised label
  */
  raisedLabel: PropTypes.string,

  /**
  * Target label
  */
  targetLabel: PropTypes.string,

  /**
  * Show funded label
  */
  fundedLabel: PropTypes.string,

  /**
  * Show time remaining label
  */
  remainingLabel: PropTypes.string,

  /**
  * The format of the number
  */
  format: PropTypes.string,

  /**
  * Props to be passed to the Constructicon ProgressBar component
  */
  progressBar: PropTypes.object,

  /**
  * Interval (in milliseconds) to refresh data from API
  */
  refreshInterval: PropTypes.number
}

ProgressBar.defaultProps = {
  excludeOffline: false,
  format: '0,0',
  offset: 0
}

export default ProgressBar
