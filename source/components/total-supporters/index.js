import React from 'react'
import PropTypes from 'prop-types'
import { formatNumber, setLocaleFromCountry } from '../../utils/numbers'
import { fetchPagesTotals } from '../../api/pages-totals'
import useAsync from '../../hooks/use-async'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

const TotalSupporters = ({
  active,
  campaign,
  charity,
  country,
  endDate,
  event,
  icon,
  label,
  metric,
  multiplier,
  offset,
  places,
  refreshInterval,
  tagId,
  tagValue,
  type,
  startDate
}) => {
  const fetchData = () =>
    fetchPagesTotals({
      active,
      campaign,
      charity,
      event,
      country,
      type,
      startDate,
      endDate,
      tagId,
      tagValue
    })

  const { data, status } = useAsync(fetchData, { refreshInterval })

  if (status === 'failed') return <Icon name='warning' />

  if (status === 'fetched') {
    const formattedAmount = formatNumber({
      amount: (offset + data) * multiplier,
      locale: setLocaleFromCountry(country),
      places
    })

    return (
      <Metric
        icon={icon}
        label={label}
        amount={formattedAmount}
        {...metric}
      />
    )
  }

  return <Loading />
}

TotalSupporters.propTypes = {
  /**
   * The campaign uid to fetch totals for
   */
  campaign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The charity uid to fetch totals for
   */
  activity: PropTypes.oneOf([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * Country code for API (JG only)
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
   * The type of page to include in the leaderboard
   */
  type: PropTypes.oneOf(['individual', 'team', 'all']),

  /**
   * Whether to include active pages
   */
  active: PropTypes.oneOfType([PropTypes.string, PropTypes.bool]),

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

TotalSupporters.defaultProps = {
  country: 'gb',
  label: 'Supporters',
  offset: 0,
  multiplier: 1,
  places: 0,
  type: 'individual'
}

export default TotalSupporters
