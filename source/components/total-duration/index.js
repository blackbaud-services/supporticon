import React from 'react'
import PropTypes from 'prop-types'
import { useFitnessTotals } from '../../hooks/use-fitness-totals'
import { formatDuration } from '../../utils/fitness'
import { formatNumber } from '../../utils/numbers'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

const TotalDuration = ({
  activity,
  campaign,
  endDate,
  icon,
  label,
  metric,
  multiplier,
  offset,
  places,
  refreshInterval: refetchInterval,
  startDate,
  tagId,
  tagValue,
  units
}) => {
  const { data, status } = useFitnessTotals({
    campaign,
    endDate,
    startDate,
    tagId,
    tagValue
  }, { refetchInterval })

  if (status === 'error') return <Icon name='warning' />

  if (status === 'success') {
    const formatAmount = label => {
      const amount = (offset + data.duration) * multiplier

      return units
        ? formatDuration({ amount, label })
        : formatNumber({ amount, places })
    }

    return (
      <Metric
        icon={icon}
        label={label}
        amount={formatAmount()}
        amountLabel={formatAmount('full')}
        {...metric}
      />
    )
  }

  return <Loading />
}

TotalDuration.propTypes = {
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
   * The max number of places after decimal point to display
   */
  places: PropTypes.number,

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
  refreshInterval: PropTypes.number,

  /**
   * The tag ID to filter by
   */
  tagId: PropTypes.string,

  /**
   * The tag value to filter by
   */
  tagValue: PropTypes.string
}

TotalDuration.defaultProps = {
  label: 'Total Duration',
  multiplier: 1,
  places: 0,
  offset: 0,
  units: true
}

export default TotalDuration
