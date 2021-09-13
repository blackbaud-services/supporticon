import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'
import {
  formatActivities,
  formatDistance,
  formatDuration,
  formatElevation,
  formatMeasurementDomain
} from '../../utils/fitness'

import Filter from 'constructicon/filter'
import Grid from 'constructicon/grid'
import LeaderboardItem from 'constructicon/leaderboard-item'
import LeaderboardWrapper from 'constructicon/leaderboard'
import Pagination from 'constructicon/pagination'
import PaginationLink from 'constructicon/pagination-link'
import RichText from 'constructicon/rich-text'
import Section from 'constructicon/section'

import {
  fetchFitnessLeaderboard,
  deserializeFitnessLeaderboard
} from '../../api/fitness-leaderboard'

class FitnessLeaderboard extends Component {
  constructor () {
    super()
    this.fetchLeaderboard = this.fetchLeaderboard.bind(this)
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

  handleSetFilter (q) {
    this.setState({ q })
    this.fetchLeaderboard(q)
  }

  fetchLeaderboard (q, refresh) {
    const {
      activeOnly,
      activity,
      campaign,
      charity,
      country,
      deserializeMethod,
      endDate,
      excludePageIds,
      limit,
      page,
      sortBy,
      startDate,
      tagId,
      tagValue,
      type
    } = this.props

    !refresh &&
      this.setState({
        status: 'fetching',
        data: undefined
      })

    fetchFitnessLeaderboard({
      activeOnly,
      activity,
      campaign,
      charity,
      country,
      endDate,
      limit: limit + 10,
      page,
      q,
      sortBy: formatMeasurementDomain(sortBy),
      startDate,
      tagId,
      tagValue,
      type
    })
      .then(data => this.removeExcludedPages(excludePageIds, data, tagId))
      .then(data =>
        data.map(deserializeMethod || deserializeFitnessLeaderboard)
      )
      .then(data => data.slice(0, limit))
      .then(data => {
        this.setState({
          status: 'fetched',
          data
        })
      })
      .catch(error => {
        this.setState({
          status: 'failed'
        })
        return Promise.reject(error)
      })
  }

  removeExcludedPages (excludePageIds, pages, tagId) {
    if (!excludePageIds) return pages

    return pages.filter(page => {
      const item = deserializeFitnessLeaderboard(page)
      const id = tagId ? item.name : item.id

      const excluded = Array.isArray(excludePageIds)
        ? excludePageIds
        : excludePageIds.split(',')

      return excluded.indexOf(id.toString()) === -1
    })
  }

  render () {
    const { status, data = [] } = this.state
    const { leaderboard, filter, pageSize, showPage } = this.props

    return (
      <div>
        {filter && <Filter onChange={this.handleSetFilter} {...filter} />}
        {(status === 'fetching' || status === 'failed')
          ? (
            <LeaderboardWrapper
              {...leaderboard}
              loading={status === 'fetching'}
              error={status === 'failed'}
            />
            )
          : data.length
            ? (
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
                    {pageSize &&
                      isPaginated && (
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
              )
            : (
              <LeaderboardWrapper {...leaderboard} empty />
              )}
      </div>
    )
  }

  renderLeader (leader, i) {
    const { leaderboardItem = {}, subtitleMethod } = this.props

    return (
      <LeaderboardItem
        key={i}
        title={leader.name}
        subtitle={subtitleMethod(leader)}
        image={leader.image}
        amount={this.getMetric(leader)}
        amountLabel={this.getMetricLabel(leader)}
        href={leader.url}
        rank={leader.position}
        {...leaderboardItem}
      />
    )
  }

  getMetric (leader) {
    const { miles, multiplier, offset, sortBy, units } = this.props
    const { totals = {} } = leader
    const distance = (offset + leader.distance) * multiplier

    switch (sortBy) {
      case 'activities':
        return formatActivities((offset + totals.count) * multiplier)
      case 'duration':
        return formatDuration((offset + totals.seconds) * multiplier)
      case 'elevation':
        return formatElevation((offset + totals.meters) * multiplier, miles)
      default:
        return units
          ? formatDistance(distance, miles)
          : numbro(distance).format('0,0')
    }
  }

  getMetricLabel (leader) {
    const { miles, multiplier, offset, sortBy, units } = this.props
    const { totals = {} } = leader
    const distance = (offset + leader.distance) * multiplier

    switch (sortBy) {
      case 'activities':
        return formatActivities((offset + totals.count) * multiplier)
      case 'duration':
        return formatDuration((offset + totals.seconds) * multiplier, 'full')
      case 'elevation':
        return formatElevation(
          (offset + totals.meters) * multiplier,
          miles,
          'full'
        )
      default:
        return units
          ? formatDistance(distance, miles, 'full')
          : numbro(distance).format('0,0')
    }
  }
}

FitnessLeaderboard.propTypes = {
  /**
   * The campaign uid to fetch pages for
   */
  campaign: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * The charity uid to fetch pages for
   */
  charity: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * The type of page to include in the leaderboard
   */
  type: PropTypes.oneOf(['individual', 'team']),

  /**
   * The activity type of page to include in the leaderboard (walk, run, ride, hike, swim, wheelchair)
   */
  activity: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * Start date filter (ISO Format)
   */
  startDate: PropTypes.string,

  /**
   * End date filter (ISO Format)
   */
  endDate: PropTypes.string,

  /**
   * Use imperial units (miles, feet, yards)
   */
  miles: PropTypes.bool,

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
   * The type of measurement to sort by
   */
  sortBy: PropTypes.oneOf(['distance', 'duration', 'elevation']),

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
   * Include distance units?
   */
  units: PropTypes.bool,

  /**
   * Only show active pages?
   */
  activeOnly: PropTypes.bool,

  /**
   * Offset to be applied to each page distance
   */
  offset: PropTypes.number,

  /**
   * The amount to multiply each page distance by for custom conversions
   */
  multiplier: PropTypes.number,

  /**
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number,

  /**
   * A function to
   */
  subtitleMethod: PropTypes.func
}

FitnessLeaderboard.defaultProps = {
  activeOnly: true,
  filter: {},
  limit: 10,
  multiplier: 1,
  offset: 0,
  page: 1,
  showPage: false,
  sortBy: 'distance',
  subtitleMethod: item => item.subtitle,
  units: true
}

export default FitnessLeaderboard
