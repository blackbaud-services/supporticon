import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'
import { useFitnessTotals } from '../../hooks/use-fitness-totals'
import { formatElevation } from '../../utils/fitness'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

const TotalElevation = ({
  activity,
  campaign,
  endDate,
  format,
  icon,
  label,
  metric,
  miles,
  multiplier,
  offset,
  refreshInterval,
  startDate,
  units
}) => {
  const { data, status } = useFitnessTotals({
    activity,
    campaign,
    endDate,
    refreshInterval,
    startDate
  })

  console.log('TotalElevation', status, data)

  const formatAmount = labelFormat => {
    const amount = (offset + data.elevation) * multiplier

    return units
      ? formatElevation(amount, miles, labelFormat)
      : numbro(amount).format(format)
  }

  return (
    <Metric
      icon={icon}
      label={label}
      amount={
        status === 'fetched' ? (
          formatAmount()
        ) : status === 'fetching' ? (
          <Loading />
        ) : (
          <Icon name='warning' />
        )
      }
      amountLabel={
        status === 'fetched'
          ? formatAmount('full')
          : status === 'fetching'
            ? 'Loading'
            : 'Error'
      }
      {...metric}
    />
  )
}

TotalElevation.propTypes = {
  /**
   * The campaign uid/s to fetch totals for
   */
  campaign: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * The type of activity to get kms for
   * e.g. [walk, run, ride, swim, wheelchair]
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
   * Use imperial units (miles, feet, yards)
   */
  miles: PropTypes.bool,

  /**
   * Include elevation units?
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

TotalElevation.defaultProps = {
  format: '0,0',
  label: 'Total Elevation',
  miles: false,
  multiplier: 1,
  offset: 0,
  units: true
}

export default TotalElevation
