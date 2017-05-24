import React, { Component, PropTypes } from 'react'
import numbro from 'numbro'
import Filter from 'constructicon/filter'
import LeaderboardWrapper from 'constructicon/leaderboard'
import LeaderboardItem from 'constructicon/leaderboard-item'

import {
  fetchLeaderboard,
  deserializeLeaderboard
} from '../../api/leaderboard'

class Leaderboard extends Component {
  constructor () {
    super()
    this.setFilter = this.setFilter.bind(this)
    this.renderLeader = this.renderLeader.bind(this)
    this.state = { status: 'fetching' }
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

  fetchLeaderboard (q) {
    const {
      campaign,
      charity,
      type,
      group,
      startDate,
      endDate,
      limit,
      page
    } = this.props

    this.setState({
      status: 'fetching',
      data: undefined
    })

    fetchLeaderboard({
      campaign,
      charity,
      type,
      group,
      startDate,
      endDate,
      limit,
      page,
      q
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
      data = []
    } = this.state

    const {
      leaderboard,
      filter
    } = this.props

    return (
      <div>
        {filter && <Filter onChange={this.setFilter} {...filter} />}
        <LeaderboardWrapper
          loading={status === 'fetching'}
          error={status === 'failed'}
          children={data.map(this.renderLeader)}
          {...leaderboard}
        />
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
        amount={numbro(leader.raised / 100).format('$0,0')}
        href={leader.url}
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
  type: PropTypes.oneOf([ 'individual', 'team' ]),

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
  * The page to fetch
  */
  page: PropTypes.number,

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

export default Leaderboard
