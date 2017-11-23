import React, { Component } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'
import Filter from 'constructicon/filter'
import LeaderboardWrapper from 'constructicon/leaderboard'
import LeaderboardItem from 'constructicon/leaderboard-item'

import {
  fetchFitnessLeaderboard,
  deserializeFitnessLeaderboard
} from '../../api/fitness-leaderboard'

class FitnessLeaderboard extends Component {
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
      includeManual,
      excludeVirtual,
      limit,
      page
    } = this.props

    this.setState({
      status: 'fetching',
      data: undefined
    })

    fetchFitnessLeaderboard({
      campaign,
      charity,
      type,
      group,
      startDate,
      endDate,
      include_manual: includeManual,
      exclude_virtual: excludeVirtual,
      limit,
      page,
      q
    })
      .then((data) => {
        this.setState({
          status: 'fetched',
          data: data.map(deserializeFitnessLeaderboard)
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
    const {
      leaderboardItem = {},
      miles
    } = this.props

    const finalDistance = miles ? leader.distance / 1609.34 : leader.distance / 1000

    return (
      <LeaderboardItem
        key={i}
        title={leader.name}
        subtitle={leader.charity}
        image={leader.image}
        amount={`${numbro(finalDistance).format('0,0')} ${miles ? 'mi.' : 'kms'}`}
        href={leader.url}
        {...leaderboardItem}
      />
    )
  }
}

FitnessLeaderboard.propTypes = {
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
  * The activity type of page to include in the leaderboard (bike, gym, hike, run, sport, swim, walk)
  */
  activity: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.array
  ]),

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

FitnessLeaderboard.defaultProps = {
  limit: 10,
  page: 1,
  filter: {}
}

export default FitnessLeaderboard
