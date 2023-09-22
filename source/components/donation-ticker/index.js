import Loading from 'constructicon/loading';
import Metric from 'constructicon/metric';
import Ticker from 'constructicon/ticker';
import PropTypes from 'prop-types';
import React from 'react';

import { useDonationFeed } from '../../hooks/use-donation-feed';
import { formatCurrency } from '../../utils/numbers';

const DonationTicker = ({
  campaign,
  charity,
  donationRef,
  event,
  includeOffline,
  label,
  layout,
  limit,
  page,
  refreshInterval: refetchInterval,
  team,
  ticker,
}) => {
  const { data = [], status } = useDonationFeed(
    {
      campaign,
      charity,
      donationRef,
      event,
      includeOffline,
      limit,
      page,
      team,
    },
    {
      refetchInterval,
    }
  );

  const formatDonation = (donation) => {
    const formattedAmount = formatCurrency({
      amount: donation.amount,
      currencyCode: donation.currency,
    });

    switch (layout) {
      case 'name-only':
        return donation.name;
      case 'amount-only':
        return formattedAmount;
      case 'message-only':
        return donation.message;
      case 'name-message':
        return <span>{[donation.name, donation.message].filter(Boolean).join(' - ')}</span>;
      case 'message-amount':
        return (
          <span>
            {donation.message} <strong>{formattedAmount}</strong>
          </span>
        );
      case 'name-message-amount':
        return (
          <span>
            {[donation.name, donation.message].filter(Boolean).join(' - ')}{' '}
            <strong>{formattedAmount}</strong>
          </span>
        );
      case 'amount-name':
        return (
          <span>
            <strong>{formattedAmount}</strong> {donation.name}
          </span>
        );
      default:
        return (
          <span>
            {donation.name} <strong>{formattedAmount}</strong>
          </span>
        );
    }
  };

  if (status === 'error') {
    return <Metric icon="warning" label="An error occurred" amount={0} />;
  }

  if (status === 'success' && data) {
    const donations = data
      .filter((donation) => {
        if (donation.anonymous) return false;
        if (layout.indexOf('amount') > -1) return !!donation.amount;
        if (layout.indexOf('message') > -1) return !!donation.message;
        if (layout.indexOf('name') > -1) return !!donation.name;
        return true;
      })
      .map(formatDonation);

    return <Ticker label={label} items={donations} {...ticker} />;
  }

  return <Loading />;
};

DonationTicker.propTypes = {
  /**
   * The campaign uid to fetch feed for
   */
  campaign: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),

  /**
   * The charity uid to fetch feed for
   */
  charity: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),

  /**
   * The donation ref to fetch feed for
   */
  donationRef: PropTypes.string,

  /**
   * The event id to fetch feed for
   */
  event: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),

  /**
   * The page uid to fetch feed for
   */
  page: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),

  /**
   * The team uid to fetch feed for
   */
  team: PropTypes.oneOfType([PropTypes.string, PropTypes.object, PropTypes.array]),

  /**
   * Donation display format
   */
  layout: PropTypes.oneOf([
    'amount-name',
    'name-amount',
    'name-message',
    'name-message-amount',
    'message-amount',
    'amount-only',
    'name-only',
    'message-only',
  ]),

  /**
   * Label text
   */
  label: PropTypes.string,

  /**
   * Limit of API requests to make
   */
  limit: PropTypes.number,

  /**
   * Include offline donations
   */
  includeOffline: PropTypes.bool,

  /**
   * Props to be passed to the Constructicon Ticker component
   */
  ticker: PropTypes.object,

  /**
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number,
};

DonationTicker.defaultProps = {
  layout: 'name-amount',
  ticker: {},
};

export default DonationTicker;
