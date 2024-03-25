import React, { useState } from 'react'
import PropTypes from 'prop-types'
import { useLeaderboard } from '../../hooks/use-leaderboard'
import { formatCurrency, formatNumber, setLocaleFromCountry } from '../../utils/numbers'
import { currencyCode } from '../../utils/currencies'
import { formatMeasurementDomain } from '../../utils/tags'

import Filter from 'constructicon/filter'
import Grid from 'constructicon/grid'
import LeaderboardItem from 'constructicon/leaderboard-item'
import LeaderboardWrapper from 'constructicon/leaderboard'
import Pagination from 'constructicon/pagination'
import PaginationLink from 'constructicon/pagination-link'
import RichText from 'constructicon/rich-text'
import Section from 'constructicon/section'

const Leaderboard = ({
  allPages,
  campaign,
  charity,
  country,
  currency,
  deserializeMethod,
  endDate,
  event,
  excludePageIds,
  filter,
  leaderboard,
  leaderboardItem = {},
  limit,
  maxAmount,
  minAmount,
  multiplier,
  offset,
  page,
  pageIds,
  pageSize,
  places,
  refreshInterval: refetchInterval,
  showPage,
  sortBy,
  startDate,
  subtitleMethod,
  tagId,
  tagValue,
  type,
  useOwnerImage
}) => {
  const [query, setQuery] = useState('')
  const { data = [], status } = useLeaderboard(
    {
      allPages,
      campaign,
      charity,
      country,
      endDate,
      event,
      excludePageIds,
      limit,
      maxAmount,
      minAmount,
      page,
      pageIds,
      q: query,
      sortBy: formatMeasurementDomain(sortBy),
      startDate,
      tagId,
      tagValue,
      type
    },
    {
      refetchInterval,
      deserializeMethod
    }
  )

  const leaderboardData = data
    .map((item, index) => ({ ...item, position: index + 1 }))
    .slice(0, limit)

  return (
    <div>
      {filter && <Filter onChange={setQuery} {...filter} />}
      {status === 'loading' && <LeaderboardWrapper {...leaderboard} loading />}
      {status === 'error' && <LeaderboardWrapper {...leaderboard} error />}
      {status === 'success' && leaderboardData.length === 0 && (
        <LeaderboardWrapper {...leaderboard} empty />
      )}
      {status === 'success' && (
        <Pagination max={pageSize} toPaginate={leaderboardData}>
          {({
            currentPage,
            isPaginated,
            prev,
            next,
            canPrev,
            canNext,
            pageOf
          }) => (
            <>
              <LeaderboardWrapper {...leaderboard}>
                {currentPage.map((leader, index) => {
                  const metric = sortBy === 'donations'
                    ? leader.totalDonations
                    : leader.raised
                  const amount = (offset + metric) * multiplier
                  const locale = setLocaleFromCountry(country)
                  const showCurrency = currency && sortBy !== 'donations'

                  return (
                    <LeaderboardItem
                      key={page.id || index}
                      title={leader.name}
                      subtitle={subtitleMethod(leader)}
                      image={useOwnerImage ? leader.ownerImage || leader.image : leader.image}
                      amount={
                        showCurrency
                          ? formatCurrency({
                              amount,
                              currencyCode: leader.currency || currencyCode(country),
                              locale,
                              places
                            })
                          : formatNumber({ amount, locale, places })
                      }
                      href={leader.url}
                      rank={leader.position}
                      {...leaderboardItem}
                    />
                  )
                })}
              </LeaderboardWrapper>
              {pageSize && isPaginated && (
                <Section spacing={{ t: 0.5 }}>
                  <Grid align='center' justify='center'>
                    <PaginationLink
                      onClick={prev}
                      direction='prev'
                      disabled={!canPrev}
                    />
                    {showPage && <RichText size={-1}>{pageOf}</RichText>}
                    <PaginationLink
                      onClick={next}
                      direction='next'
                      disabled={!canNext}
                    />
                  </Grid>
                </Section>
              )}
            </>
          )}
        </Pagination>
      )}
    </div>
  )
}

Leaderboard.propTypes = {
  /**
   * The campaign uid to fetch pages for
   */
  campaign: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The charity uid to fetch pages for
   */
  charity: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * The event uid to fetch pages for (JG only)
   */
  event: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.object,
    PropTypes.array
  ]),

  /**
   * Country code
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
  type: PropTypes.oneOf(['individual', 'team', 'group']),

  /**
   * Start date filter (ISO Format)
   */
  startDate: PropTypes.string,

  /**
   * End date filter (ISO Format)
   */
  endDate: PropTypes.string,

  /**
   * The number of records to fetch
   */
  limit: PropTypes.number,

  /**
   * The number of records to show per page, disables pagination if not specified.
   */
  pageSize: PropTypes.number,

  /**
   * The page to fetch
   */
  page: PropTypes.number,

  /**
   * The tag ID to group the leaderboard by
   */
  tagId: PropTypes.string,

  /**
   * The tag value to filter by
   */
  tagValue: PropTypes.string,

  /**
   * Override the deserializeLeaderboard method
   */
  deserializeMethod: PropTypes.func,

  /**
   * Props to be passed to the Constructicon Leaderboard component
   */
  leaderboard: PropTypes.object,

  /**
   * Props to be passed to the Constructicon LeaderboardItem component
   */
  leaderboardItem: PropTypes.object,

  /**
   * Props to be passed to the Filter component (false to hide)
   */
  filter: PropTypes.any,

  /**
   * Format page amount as currency?
   */
  currency: PropTypes.bool,

  /**
   * The number format of the page amount
   */
  format: PropTypes.string,

  /**
   * Offset to be applied to each page amount
   */
  offset: PropTypes.number,

  /**
   * The amount to multiply each page amount by for custom conversions
   */
  multiplier: PropTypes.number,

  /**
   * The max number of places after decimal point to display
   */
  places: PropTypes.number,

  /**
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number,

  /**
   * The type of measurement to sort by
   */
  sortBy: PropTypes.oneOf(['raised', 'donations']),

  /**
   * The field to show as a subtitle
   */
  subtitleMethod: PropTypes.func
}

Leaderboard.defaultProps = {
  country: 'gb',
  currency: true,
  filter: {},
  limit: 10,
  multiplier: 1,
  offset: 0,
  page: 1,
  places: 0,
  showPage: false,
  subtitleMethod: item => item.subtitle
}

export default Leaderboard
