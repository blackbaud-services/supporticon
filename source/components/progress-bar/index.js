import React, { Component } from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import numbro from 'numbro'
import {
  fetchDonationTotals,
  deserializeDonationTotals
} from '../../api/donation-totals'

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
      country,
      donationRef,
      endDate,
      event,
      excludeOffline,
      startDate
    } = this.props

    fetchDonationTotals({
      campaign,
      charity,
      donationRef,
      country,
      endDate,
      event,
      includeOffline: !excludeOffline,
      startDate
    })
      .then(data => deserializeDonationTotals(data, excludeOffline))
      .then(data => this.setState({ status: 'fetched', ...data }))
      .catch(() => this.setState({ status: 'failed' }))
  }

  calculateDaysRemaining (eventDate) {
    const today = dayjs()
    const eventDateObj = dayjs(eventDate)
    const daysDiff = Math.ceil(eventDateObj.diff(today, 'days', true)) // we want to round up
    return Math.max(0, daysDiff)
  }

  calculatePercentage () {
    const { offset, target, useDonationCount } = this.props
    const { raised = 0, donations = 0 } = this.state
    const amount = useDonationCount ? donations : raised
    return Math.min(100, Math.floor(((amount + offset) / target) * 100))
  }

  render () {
    const {
      eventDate,
      format,
      fundedLabel,
      grid,
      heading,
      metric,
      offset,
      progressBar,
      raisedLabel,
      remainingLabel,
      target,
      targetLabel,
      useDonationCount
    } = this.props

    const { raised, donations, status } = this.state

    return status === 'fetched' ? (
      <Grid spacing={0.25} {...grid}>
        <GridColumn xs={6}>
          <Metric
            align='left'
            label={raisedLabel}
            amount={
              useDonationCount
                ? numbro(donations + offset).format(format)
                : numbro(raised + offset).formatCurrency(format)
            }
            {...metric}
          />
        </GridColumn>
        <GridColumn xs={6} xsAlign='right'>
          <Metric
            align='right'
            label={targetLabel}
            amount={
              useDonationCount
                ? numbro(target).format(format)
                : numbro(target).formatCurrency(format)
            }
            {...metric}
          />
        </GridColumn>
        <GridColumn>
          <Progress
            alt='<%= progress %>% there'
            progress={this.calculatePercentage()}
            {...progressBar}
          />
        </GridColumn>
        {fundedLabel ? (
          <GridColumn xs={6}>
            <Heading size={0} tag='strong' {...heading}>
              {this.calculatePercentage()}%
            </Heading>{' '}
            {fundedLabel}
          </GridColumn>
        ) : (
          <GridColumn xs={6} />
        )}
        {remainingLabel &&
          eventDate && (
          <GridColumn xs={6} xsAlign='right'>
            <Heading size={0} tag='strong' {...heading}>
              {this.calculateDaysRemaining(eventDate)}
            </Heading>{' '}
            {remainingLabel}
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
    PropTypes.array,
    PropTypes.object
  ]),

  /**
   * The charity uid to fetch totals for
   */
  charity: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array,
    PropTypes.object
  ]),

  /**
   * The donation ref to fetch totals for
   */
  donationRef: PropTypes.string,

  /**
   * The event uid to fetch totals for
   */
  event: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

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
   * Props to be passed to the Constructicon Grid component
   */
  grid: PropTypes.object,

  /**
   * Props to be passed to the Constructicon Heading components
   */
  heading: PropTypes.object,

  /**
   * Props to be passed to the Constructicon Metric components
   */
  metric: PropTypes.object,

  /**
   * Props to be passed to the Constructicon ProgressBar component
   */
  progressBar: PropTypes.object,

  /**
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number,

  /**
   * use number of donations instead of amount raised
   */
  useDonationCount: PropTypes.bool
}

ProgressBar.defaultProps = {
  excludeOffline: false,
  format: '0,0',
  offset: 0
}

export default ProgressBar
