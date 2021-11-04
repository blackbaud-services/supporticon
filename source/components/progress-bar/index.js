import React from 'react'
import PropTypes from 'prop-types'
import dayjs from 'dayjs'
import { useDonationTotals } from '../../hooks/use-donation-totals'
import {
  formatCurrency,
  formatNumber,
  setLocaleFromCountry
} from '../../utils/numbers'

import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import Heading from 'constructicon/heading'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'
import Progress from 'constructicon/progress-bar'

const ProgressBar = ({
  campaign,
  charity,
  country,
  donationRef,
  endDate,
  event,
  excludeOffline,
  eventDate,
  fundedLabel,
  grid,
  heading,
  metric,
  offset,
  places,
  progressBar,
  raisedLabel,
  refreshInterval: refetchInterval,
  remainingLabel,
  startDate,
  target,
  targetLabel,
  useDonationCount
}) => {
  const { data, status } = useDonationTotals({
    campaign,
    charity,
    donationRef,
    country,
    endDate,
    event,
    includeOffline: !excludeOffline,
    startDate
  }, { refetchInterval })

  const calculateDaysRemaining = eventDate => {
    const today = dayjs()
    const eventDateObj = dayjs(eventDate)
    const daysDiff = Math.ceil(eventDateObj.diff(today, 'days', true)) // we want to round up
    return Math.max(0, daysDiff)
  }

  const calculatePercentage = () => {
    const amount = useDonationCount ? data.donations : data.raised
    return Math.min(100, Math.floor(((amount + offset) / target) * 100))
  }

  const locale = setLocaleFromCountry(country)

  if (status === 'success') {
    return (
      <Grid spacing={0.25} {...grid}>
        <GridColumn xs={6}>
          <Metric
            align='left'
            label={raisedLabel}
            amount={
              useDonationCount
                ? formatNumber({ amount: data.donations + offset, locale, places })
                : formatCurrency({ amount: data.raised + offset, locale, places })
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
                ? formatNumber({ amount: target, locale })
                : formatCurrency({ amount: target, locale })
            }
            {...metric}
          />
        </GridColumn>
        <GridColumn>
          <Progress
            alt='<%= progress %>% there'
            progress={calculatePercentage()}
            {...progressBar}
          />
        </GridColumn>
        <GridColumn xs={6}>
          {fundedLabel && (
            <>
              <Heading size={0} tag='strong' {...heading}>
                {calculatePercentage()}%
              </Heading>{' '}
              {fundedLabel}
            </>
          )}
        </GridColumn>
        {remainingLabel && eventDate && (
          <GridColumn xs={6} xsAlign='right'>
            <Heading size={0} tag='strong' {...heading}>
              {calculateDaysRemaining(eventDate)}
            </Heading>{' '}
            {remainingLabel}
          </GridColumn>
        )}
      </Grid>
    )
  }

  return <Loading />
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
   * The max number of places after decimal point to display
   */
  places: PropTypes.number,

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
  country: 'gb',
  excludeOffline: false,
  offset: 0,
  places: 0
}

export default ProgressBar
