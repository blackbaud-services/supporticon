import React, { Component } from 'react'
import orderBy from 'lodash/orderBy'
import PropTypes from 'prop-types'
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

import { fetchLeaderboard, deserializeLeaderboard } from '../../api/leaderboard'

class Leaderboard extends Component {
  constructor () {
    super()
    this.fetchLeaderboard = this.fetchLeaderboard.bind(this)
    this.handleData = this.handleData.bind(this)
    this.handleSetFilter = this.handleSetFilter.bind(this)
    this.renderLeader = this.renderLeader.bind(this)

    this.state = {
      status: 'fetching',
      q: null
    }
  }

  componentDidMount () {
    const { refreshInterval } = this.props
    this.fetchLeaderboard()
    this.interval =
      refreshInterval &&
      setInterval(
        () => this.fetchLeaderboard(this.state.q, true),
        refreshInterval
      )
  }

  componentWillUnmount () {
    clearInterval(this.interval)
  }

  componentDidUpdate (prevProps) {
    if (this.props !== prevProps) {
      this.fetchLeaderboard(this.state.q)
    }
  }

  handleSetFilter (filterValue) {
    const q = filterValue || null
    this.setState({ q })
    this.fetchLeaderboard(q)
  }

  handleData (data) {
    const { excludeOffline, deserializeMethod, limit, sortBy } = this.props
    const handleDeserializeData = deserializeMethod || deserializeLeaderboard

    const leaderboardData = data
      .filter(item => item.status !== 'Cancelled')
      .map(handleDeserializeData)
      .map(item =>
        excludeOffline ? { ...item, raised: item.raised - item.offline } : item
      )

    return orderBy(leaderboardData, [sortBy], ['desc'])
      .map((item, index) => ({ ...item, position: index + 1 }))
      .slice(0, limit)
  }

  fetchLeaderboard (q, refresh) {
    const {
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
      sortBy,
      startDate,
      tagId,
      tagValue,
      type,
      useGraphql
    } = this.props

    !refresh &&
      this.setState({
        status: 'fetching',
        data: undefined
      })

    fetchLeaderboard({
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
      q,
      sortBy: formatMeasurementDomain(sortBy),
      startDate,
      tagId,
      tagValue,
      type,
      useGraphql
    })
      .then(data => {
        this.setState({
          status: 'fetched',
          data: this.handleData(data)
        })
      })
      .catch(error => {
        this.setState({
          status: 'failed'
        })
        return Promise.reject(error)
      })
  }

  render () {
    const { status, data = [] } = this.state
    const { leaderboard, filter, pageSize, showPage } = this.props

    return (
      <div>
        {filter && <Filter onChange={this.handleSetFilter} {...filter} />}
        {status === 'fetching' && (
          <LeaderboardWrapper {...leaderboard} loading />
        )}
        {status === 'error' && <LeaderboardWrapper {...leaderboard} error />}
        {status === 'fetched' && data.length === 0 && (
          <LeaderboardWrapper {...leaderboard} empty />
        )}
        {data.length > 0 && (
          <Pagination max={pageSize} toPaginate={data}>
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
                  {currentPage.map(this.renderLeader)}
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

  renderLeader (leader, i) {
    const {
      country,
      currency,
      leaderboardItem = {},
      multiplier,
      places,
      sortBy,
      subtitleMethod,
      offset,
      useOwnerImage
    } = this.props

    const metric = sortBy === 'donations' ? leader.totalDonations : leader.raised
    const amount = (offset + metric) * multiplier
    const locale = setLocaleFromCountry(country)
    const showCurrency = currency && sortBy !== 'donations'

    return (
      <LeaderboardItem
        key={i}
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
  }
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
  type: PropTypes.oneOf(['individual', 'team']),

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
