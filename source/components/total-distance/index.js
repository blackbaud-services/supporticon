import React from 'react'
import PropTypes from 'prop-types'
import { fetchFitnessTotals } from '../../api/fitness-totals'
import { formatDistance } from '../../utils/fitness'
import { formatCurrency } from '../../utils/numbers'
import useAsync from '../../hooks/use-async'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

const TotalDistance = ({
  activity,
  campaign,
  endDate,
  icon,
  label,
  metric,
  miles,
  multiplier,
  offset,
  places,
  refreshInterval,
  startDate,
  units
}) => {
  const fetchData = () =>
    fetchFitnessTotals({
      campaign,
      startDate,
      endDate,
      types: activity
    }).then(({ distance }) => distance)

  const { data, status } = useAsync(fetchData, { refreshInterval })

  if (status === 'failed') return <Icon name='warning' />
  if (status === 'fetched') {
    const amount = (offset + data) * multiplier
    return (
      <Metric
        icon={icon}
        label={label}
        amount={
          units
            ? formatDistance({ amount, miles, places })
            : formatCurrency({ amount })
        }
        amountLabel={
          units
            ? formatDistance({ amount, miles, label: 'full', places })
            : formatCurrency({ amount })
        }
        {...metric}
      />
    )
  }
  return <Loading />
}

TotalDistance.propTypes = {
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
   * The label of the metric
   */
  label: PropTypes.string,

  /**
   * The max number of places after decimal point to display
   */
  places: PropTypes.number,

  /**
   * Use imperial units (miles, feet, yards)
   */
  miles: PropTypes.bool,

  /**
   * Include distance units?
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

TotalDistance.defaultProps = {
  label: 'Total Distance',
  miles: false,
  multiplier: 1,
  offset: 0,
  places: 0,
  units: true
}

export default TotalDistance
