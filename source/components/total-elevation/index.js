import React from 'react'
import PropTypes from 'prop-types'
import { useFitnessTotals } from '../../hooks/use-fitness-totals'
import { formatElevation } from '../../utils/fitness'
import { formatNumber } from '../../utils/numbers'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

const TotalElevation = ({
  campaign,
  charity,
  endDate,
  icon,
  label,
  metric,
  miles,
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
    charity,
    endDate,
    startDate,
    tagId,
    tagValue
  }, { refetchInterval })

  if (status === 'error') return <Icon name='warning' />

  if (status === 'success') {
    const formatAmount = label => {
      const amount = (offset + data.elevation) * multiplier

      return units
        ? formatElevation({ amount, miles, label, places })
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
   * The max number of places after decimal point to display
   */
  places: PropTypes.number,

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

TotalElevation.defaultProps = {
  label: 'Total Elevation',
  miles: false,
  multiplier: 1,
  offset: 0,
  places: 0,
  units: true
}

export default TotalElevation
