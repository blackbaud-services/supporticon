import React, { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import numbro from 'numbro'
import orderBy from 'lodash/orderBy'
import { deserializeTeamPage, fetchTeamPages } from '../../api/teams'
import {
  formatActivities,
  formatDistance,
  formatDuration,
  formatElevation
} from '../../utils/fitness'

import Grid from 'constructicon/grid'
import LeaderboardItem from 'constructicon/leaderboard-item'
import Leaderboard from 'constructicon/leaderboard'
import Pagination from 'constructicon/pagination'
import PaginationLink from 'constructicon/pagination-link'
import RichText from 'constructicon/rich-text'
import Section from 'constructicon/section'

const TeamLeaderboard = ({
  activeOnly,
  deserializeMethod,
  leaderboard,
  leaderboardItem,
  limit,
  miles,
  multiplier,
  offset,
  pageSize,
  refreshInterval,
  showPage,
  sortBy,
  subtitleMethod,
  team,
  units
}) => {
  const [pages, setPages] = useState([])
  const [status, setStatus] = useState('fetching')

  const sortKeys = {
    activities: 'fitnessCount',
    distance: 'fitnessDistanceTotal',
    duration: 'fitnessDurationTotal',
    elevation: 'fitnessElevationTotal'
  }

  const sortKey = sortKeys[sortBy] || 'raised'

  const sortedPages = orderBy(pages, [sortKey], ['desc'])
    .map((page, index) => ({ ...page, position: index + 1 }))
    .slice(0, limit)

  const renderAmount = (page, format) => {
    const amount = (offset + page[sortKey]) * multiplier

    if (units) {
      switch (sortBy) {
        case 'activities':
          return formatActivities(amount)
        case 'distance':
          return formatDistance(amount, miles, format)
        case 'duration':
          return formatDuration(amount, format)
        case 'elevation':
          return formatElevation(amount, miles, format)
        default:
          return numbro(amount).formatCurrency('0,0')
      }
    }

    return numbro(amount).format('0,0')
  }

  const fetchData = () =>
    fetchTeamPages(team)
      .then(data => data.map(deserializeMethod || deserializeTeamPage))
      .then(pages => (activeOnly ? pages.filter(page => page.active) : pages))
      .then(setPages)
      .then(() => setStatus('fetched'))
      .catch(error => {
        setStatus('failed')
        return Promise.reject(error)
      })

  useEffect(() => {
    fetchData()

    if (refreshInterval) {
      setInterval(fetchData, refreshInterval)
    }
  }, [])

  if (status === 'fetching' || status === 'failed') {
    return (
      <Leaderboard
        {...leaderboard}
        loading={status === 'fetching'}
        error={status === 'failed'}
      />
    )
  }

  if (!pages.length) return <Leaderboard {...leaderboard} empty />

  return (
    <Pagination max={pageSize} toPaginate={sortedPages}>
      {({ currentPage, isPaginated, prev, next, canPrev, canNext, pageOf }) => (
        <React.Fragment>
          <Leaderboard {...leaderboard}>
            {currentPage.map((page, i) => (
              <LeaderboardItem
                {...leaderboardItem}
                key={i}
                title={page.name}
                image={page.image}
                amount={renderAmount(page)}
                amountLabel={renderAmount(page, 'full')}
                href={page.url}
                rank={page.position}
                subtitle={subtitleMethod(page)}
              />
            ))}
          </Leaderboard>
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
        </React.Fragment>
      )}
    </Pagination>
  )
}

TeamLeaderboard.propTypes = {
  /**
   * The team slug to fetch pages for
   */
  team: PropTypes.string.isRequired,

  /**
   * Use imperial units (miles, feet, yards)
   */
  miles: PropTypes.bool,

  /**
   * The max number of records to show
   */
  limit: PropTypes.number,

  /**
   * The number of records to show per page, disables pagination if not specified.
   */
  pageSize: PropTypes.number,

  /**
   * Override the deserializeTeamPage method
   */
  deserializeMethod: PropTypes.func,

  /**
   * The type of measurement to sort by
   */
  sortBy: PropTypes.oneOf([
    'distance',
    'duration',
    'elevation',
    'activities',
    'raised'
  ]),

  /**
   * Props to be passed to the Constructicon Leaderboard component
   */
  leaderboard: PropTypes.object,

  /**
   * Props to be passed to the Constructicon LeaderboardItem component
   */
  leaderboardItem: PropTypes.object,

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
   * A function to determine which subtitle to show
   */
  subtitleMethod: PropTypes.func
}

TeamLeaderboard.defaultProps = {
  activeOnly: true,
  limit: 250,
  multiplier: 1,
  offset: 0,
  pageSize: 10,
  showPage: true,
  sortBy: 'raised',
  subtitleMethod: item => item.subtitle,
  units: true
}

export default TeamLeaderboard
