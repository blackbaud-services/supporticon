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
      page,
      groupID,
      sortBy
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
      groupID,
      sortBy,
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
      leaderboardItem = {}
    } = this.props

    return (
      <LeaderboardItem
        key={i}
        title={leader.name}
        subtitle={leader.charity}
        image={leader.image}
        amount={this.getMetric(leader)}
        href={leader.url}
        {...leaderboardItem}
      />
    )
  }

  getMetric (leader) {
    const {
      miles,
      sortBy
    } = this.props

    switch (sortBy) {
      case 'calories':
        return `${numbro(leader.calories).format('0,0')} cals`
      case 'duration':
        return `${numbro(leader.duration).format('0,0')} secs`
      case 'elevation':
        const elevation = miles ? leader.elevation * 3.28084 : leader.elevation
        return `${numbro(elevation).format('0,0')} ${miles ? 'ft' : 'm'}`
      default:
        const distance = miles ? leader.distance / 1609.34 : leader.distance / 1000
        return `${numbro(distance).format('0,0')} ${miles ? 'mi.' : 'kms'}`
    }
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
  type: PropTypes.oneOf([ 'group', 'individual', 'team' ]),

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
  * The group ID to group the leaderboard by (only relevant if type is group)
  */
  groupID: PropTypes.number,

  /**
  * The type of measurement to sort by
  */
  sortBy: PropTypes.oneOf([ 'distance', 'duration', 'calories', 'elevation' ]),

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
  filter: {},
  sortBy: 'distance'
}

export default FitnessLeaderboard
