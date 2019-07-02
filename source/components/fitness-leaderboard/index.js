import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'

import Filter from 'constructicon/filter'
import Grid from 'constructicon/grid'
import LeaderboardItem from 'constructicon/leaderboard-item'
import LeaderboardWrapper from 'constructicon/leaderboard'
import Pagination from 'constructicon/pagination'
import PaginationLink from 'constructicon/pagination-link'
import RichText from 'constructicon/rich-text'

import {
  fetchFitnessLeaderboard,
  deserializeFitnessLeaderboard
} from '../../api/fitness-leaderboard'

class FitnessLeaderboard extends Component {
  constructor () {
    super()
    this.fetchLeaderboard = this.fetchLeaderboard.bind(this)
    this.setFilter = this.setFilter.bind(this)
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

  setFilter (q) {
    this.setState({ q })
    this.fetchLeaderboard(q)
  }

  fetchLeaderboard (q, refresh) {
    const {
      activity,
      campaign,
      charity,
      country,
      type,
      group,
      startDate,
      endDate,
      includeManual,
      excludeVirtual,
      excludePageIds,
      limit,
      page,
      groupID,
      sortBy
    } = this.props

    !refresh &&
      this.setState({
        status: 'fetching',
        data: undefined
      })

    fetchFitnessLeaderboard({
      activity,
      campaign,
      charity,
      country,
      type,
      group,
      startDate,
      endDate,
      include_manual: includeManual,
      exclude_virtual: excludeVirtual,
      limit: limit + 10,
      page,
      groupID,
      sortBy,
      q
    })
      .then(data => this.removeExcludedPages(excludePageIds, data, type))
      .then(data => data.map(deserializeFitnessLeaderboard))
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

  removeExcludedPages (excludePageIds, pages, type) {
    if (!excludePageIds) return pages

    return pages.filter(page => {
      const item = deserializeFitnessLeaderboard(page)
      const id = type === 'group' ? item.name : item.id

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
        {filter && <Filter onChange={this.setFilter} {...filter} />}
        <LeaderboardWrapper
          loading={status === 'fetching'}
          error={status === 'failed'}
          {...leaderboard}
        >
          {data.length && (
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
                <div>
                  {currentPage.map(this.renderLeader)}
                  {pageSize &&
                    isPaginated && (
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
                  )}
                </div>
              )}
            </Pagination>
          )}
        </LeaderboardWrapper>
      </div>
    )
  }

  renderLeader (leader, i) {
    const { leaderboardItem = {} } = this.props

    return (
      <LeaderboardItem
        key={i}
        title={leader.name}
        subtitle={leader.charity}
        image={leader.image}
        amount={this.getMetric(leader)}
        href={leader.url}
        rank={leader.position}
        {...leaderboardItem}
      />
    )
  }

  getMetric (leader) {
    const { miles, sortBy } = this.props

    switch (sortBy) {
      case 'calories':
        return `${numbro(leader.calories).format('0,0')} cals`
      case 'duration':
        return `${numbro(leader.duration).format('0,0')} secs`
      case 'elevation':
        const elevation = miles ? leader.elevation * 3.28084 : leader.elevation
        return `${numbro(elevation).format('0,0')} ${miles ? 'ft' : 'm'}`
      default:
        const distance = miles
          ? leader.distance / 1609.34
          : leader.distance / 1000
        return `${numbro(distance).format('0,0')} ${miles ? 'mi.' : 'kms'}`
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
  type: PropTypes.oneOf(['group', 'individual', 'team']),

  /**
   * The activity type of page to include in the leaderboard (bike, gym, hike, run, sport, swim, walk)
   */
  activity: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * The group value(s) to filter by
   */
  group: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * Start date filter (ISO Format)
   */
  startDate: PropTypes.string,

  /**
   * End date filter (ISO Format)
   */
  endDate: PropTypes.string,

  /**
   * Include Virtual
   */
  includeVirtual: PropTypes.bool,

  /**
   * Include Manual
   */
  includeManual: PropTypes.bool,

  /**
   * Exclude Virtual
   */
  excludeVirtual: PropTypes.bool,

  /**
   * Unit
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
   * The group ID to group the leaderboard by (only relevant if type is group)
   */
  groupID: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

  /**
   * The type of measurement to sort by
   */
  sortBy: PropTypes.oneOf(['distance', 'duration', 'calories', 'elevation']),

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
   * Interval (in milliseconds) to refresh data from API
   */
  refreshInterval: PropTypes.number
}

FitnessLeaderboard.defaultProps = {
  limit: 10,
  page: 1,
  filter: {},
  showPage: false,
  sortBy: 'distance'
}

export default FitnessLeaderboard
