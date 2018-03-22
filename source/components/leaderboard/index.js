import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'
import Filter from 'constructicon/filter'
import LeaderboardWrapper from 'constructicon/leaderboard'
import LeaderboardItem from 'constructicon/leaderboard-item'
import Grid from 'constructicon/grid'
import PaginationLink from 'constructicon/pagination-link'

import {
  fetchLeaderboard,
  deserializeLeaderboard
} from '../../api/leaderboard'

class Leaderboard extends Component {
  constructor () {
    super()
    this.setFilter = this.setFilter.bind(this)
    this.renderLeader = this.renderLeader.bind(this)
    this.paginateLeaderboard = this.paginateLeaderboard.bind(this)
    this.prevPage = this.prevPage.bind(this)
    this.nextPage = this.nextPage.bind(this)
    this.state = {
      status: 'fetching',
      currentPage: 1
    }
  }

  componentDidMount () {
    this.fetchLeaderboard()
  }

  componentDidUpdate (prevProps) {
    if (this.props !== prevProps) {
      this.fetchLeaderboard()
    }
  }

  setFilter (q) {
    this.fetchLeaderboard(q)
  }

  paginateLeaderboard () {
    const { pageSize } = this.props
    const { currentPage, data = [] } = this.state
    const currentIndex = (currentPage - 1) * pageSize
    const pagedLeaderboard = data.slice(currentIndex, currentIndex + pageSize)

    return pagedLeaderboard.map(this.renderLeader)
  }

  hasNextPage () {
    const { pageSize } = this.props
    const { currentPage, data = [] } = this.state
    const totalPages = data.length / pageSize

    return currentPage < totalPages
  }

  prevPage () {
    if (this.state.currentPage > 1) {
      this.setState({ currentPage: this.state.currentPage - 1 })
    }
  }

  nextPage () {
    if (this.hasNextPage()) {
      this.setState({ currentPage: this.state.currentPage + 1 })
    }
  }

  fetchLeaderboard (q) {
    const {
      campaign,
      charity,
      endDate,
      event,
      excludePageIds,
      group,
      groupID,
      limit,
      maxAmount,
      minAmount,
      page,
      pageIds,
      startDate,
      type
    } = this.props

    this.setState({
      status: 'fetching',
      data: undefined
    })

    fetchLeaderboard({
      campaign,
      charity,
      endDate,
      event,
      excludePageIds,
      group,
      groupID,
      limit,
      maxAmount,
      minAmount,
      page,
      pageIds,
      q,
      startDate,
      type
    })
      .then((data) => {
        this.setState({
          status: 'fetched',
          data: data.map(deserializeLeaderboard)
        })
      })
      .catch((error) => {
        this.setState({
          status: 'failed'
        })
        return Promise.reject(error)
      })
  }

  render () {
    const {
      status,
      data = [],
      currentPage
    } = this.state

    const {
      leaderboard,
      filter,
      pageSize
    } = this.props

    return (
      <div>
        {filter && <Filter onChange={this.setFilter} {...filter} />}
        <LeaderboardWrapper
          loading={status === 'fetching'}
          error={status === 'failed'}
          {...leaderboard}>
          {pageSize ? this.paginateLeaderboard() : data.map(this.renderLeader)}
        </LeaderboardWrapper>
        {pageSize && (
          <Grid justify={'center'}>
            <PaginationLink onClick={this.prevPage} direction='prev' disabled={currentPage <= 1} />
            <PaginationLink onClick={this.nextPage} direction='next' disabled={!this.hasNextPage()} />
          </Grid>
        )}
      </div>
    )
  }

  renderLeader (leader, i) {
    const { leaderboardItem = {} } = this.props

    return (
      <LeaderboardItem
        key={i}
        title={leader.name}
        subtitle={leader.subtitle}
        image={leader.image}
        amount={numbro(leader.raised).formatCurrency('0,0')}
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
    PropTypes.array
  ]),

  /**
  * The charity uid to fetch pages for
  */
  charity: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),

  /**
  * The type of page to include in the leaderboard
  */
  type: PropTypes.oneOf([ 'group', 'individual', 'team' ]),

  /**
  * The group value(s) to filter by
  */
  group: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),

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
  * The group ID to group the leaderboard by (only relevant if type is group)
  */
  groupID: PropTypes.number,

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
  filter: PropTypes.any
}

Leaderboard.defaultProps = {
  limit: 10,
  page: 1,
  filter: {}
}

export default (Leaderboard)
