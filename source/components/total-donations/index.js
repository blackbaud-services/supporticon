import React from 'react'
import PropTypes from 'prop-types'
import { useDonationTotals } from '../../hooks/use-donation-totals'
import { formatNumber } from '../../utils/numbers'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

const TotalDonations = ({
  campaign,
  charity,
  country,
  donationRef,
  endDate,
  event,
  excludeOffline,
  icon,
  label,
  offset,
  metric,
  multiplier,
  refreshInterval: refetchInterval,
  startDate,
  tagId,
  tagValue
}) => {
  const { data, status } = useDonationTotals({
    campaign,
    charity,
    donationRef,
    event,
    country,
    includeOffline: !excludeOffline,
    startDate,
    endDate,
    tagId,
    tagValue
  }, { refetchInterval })

  if (status === 'error') return <Icon name='warning' />

  if (status === 'success') {
    return (
      <Metric
        icon={icon}
        label={label}
        amount={formatNumber({ amount: (offset + data.donations) * multiplier })}
        {...metric}
      />
    )
  }

  return <Loading />
}

TotalDonations.propTypes = {
  /**
   * The campaign uid to fetch totals for
   */
  campaign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The event uid to fetch totals for
   */
  event: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The charity uid to fetch totals for
   */
  charity: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The donation ref to fetch totals for
   */
  donationRef: PropTypes.string,

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
   * The amount to multiply the total by for custom conversions
   */
  multiplier: PropTypes.number,

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

TotalDonations.defaultProps = {
  excludeOffline: false,
  label: 'Donations',
  multiplier: 1,
  offset: 0
}

export default TotalDonations
