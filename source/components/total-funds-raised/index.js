import React from 'react'
import PropTypes from 'prop-types'
import {
  fetchDonationTotals,
  deserializeDonationTotals
} from '../../api/donation-totals'
import useAsync from '../../hooks/use-async'
import {
  formatCurrency,
  formatNumber,
  setLocaleFromCountry
} from '../../utils/numbers'
import { currencyCode } from '../../utils/currencies'

import Icon from 'constructicon/icon'
import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

const TotalFundsRaised = ({
  campaign,
  charity,
  country,
  currency,
  donationRef,
  endDate,
  event,
  excludeOffline,
  icon,
  label,
  metric,
  multiplier,
  offset,
  places,
  refreshInterval,
  startDate,
  tagId,
  tagValue
}) => {
  const fetchData = () =>
    fetchDonationTotals({
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
    }).then(data => deserializeDonationTotals(data, excludeOffline))

  const { data, status } = useAsync(fetchData, { refreshInterval })
  const locale = setLocaleFromCountry(country)

  if (status === 'failed') return <Icon name='warning' />

  if (status === 'fetched' && data) {
    const amount = (offset + data.raised) * multiplier
    return (
      <Metric
        icon={icon}
        label={label}
        amount={
          currency
            ? formatCurrency({
                amount,
                currencyCode: currencyCode(country),
                locale
              })
            : formatNumber({ amount, locale, places })
        }
        {...metric}
      />
    )
  }

  return <Loading />
}

TotalFundsRaised.propTypes = {
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
   * Format as currency?
   */
  currency: PropTypes.bool,

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
   * The max number of places after decimal point to display
   */
  places: PropTypes.number,

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

TotalFundsRaised.defaultProps = {
  country: 'gb',
  currency: true,
  excludeOffline: false,
  label: 'Funds Raised',
  multiplier: 1,
  offset: 0,
  places: 0
}

export default TotalFundsRaised
