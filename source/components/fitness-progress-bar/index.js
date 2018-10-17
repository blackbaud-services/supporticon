import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import numbro from 'numbro'
import { fetchFitnessTotals } from '../../api/fitness-totals'

import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import Heading from 'constructicon/heading'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'
import Progress from 'constructicon/progress-bar'

class FitnessProgressBar extends Component {
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
    const { campaign, fitnessTypes } = this.props
    fetchFitnessTotals(campaign, fitnessTypes)
      .then(({ distance }) => this.setState({ status: 'fetched', distance }))
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
    const { distance = 0 } = this.state
    return Math.min(
      100,
      Math.floor(((distance / 1000 + offset) / target) * 100)
    )
  }

  render () {
    const {
      distanceLabel,
      eventDate,
      grid,
      format,
      heading,
      metric,
      offset,
      progressBar,
      remainingLabel,
      target,
      targetLabel,
      travelledLabel,
      unit
    } = this.props

    const { status, distance: distanceInMeters = 0 } = this.state
    const distanceInKm = distanceInMeters / 1000
    const distance = unit === 'km' ? distanceInKm : distanceInKm / 0.621371

    return status === 'fetched' ? (
      <Grid spacing={0.25} {...grid}>
        <GridColumn xs={6}>
          <Metric
            align='left'
            label={distanceLabel}
            amount={`${numbro(distance + offset).format(format)}${unit}`}
            {...metric}
          />
        </GridColumn>
        <GridColumn xs={6} xsAlign='right'>
          <Metric
            align='right'
            label={targetLabel}
            amount={`${numbro(target).format(format)}${unit}`}
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
        {travelledLabel ? (
          <GridColumn xs={6}>
            <Heading size={0} tag='strong' {...heading}>
              {this.calculatePercentage()}%
            </Heading>{' '}
            {travelledLabel}
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

FitnessProgressBar.propTypes = {
  /**
   * The campaign uid to fetch totals for
   */
  campaign: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * Unit
   */
  unit: PropTypes.oneOf(['mi', 'km']),

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
  distanceLabel: PropTypes.string,

  /**
   * Target label
   */
  targetLabel: PropTypes.string,

  /**
   * Show funded label
   */
  travelledLabel: PropTypes.string,

  /**
   * Show time remaining label
   */
  remainingLabel: PropTypes.string,

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
  refreshInterval: PropTypes.number
}

FitnessProgressBar.defaultProps = {
  format: '0,0',
  unit: 'km',
  offset: 0
}

export default FitnessProgressBar
