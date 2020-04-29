import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { fetchPages, deserializePage } from '../../api/pages'
import { fetchTeams, deserializeTeam } from '../../api/teams'
import { isJustGiving } from '../../utils/client'

import SearchForm from 'constructicon/search-form'
import SearchResult from 'constructicon/search-result'
import SearchResults from 'constructicon/search-results'

class PageSearch extends Component {
  constructor () {
    super()
    this.sendQuery = this.sendQuery.bind(this)
    this.state = {
      status: 'inactive',
      data: [],
      teams: []
    }
  }

  componentDidMount () {
    const { campaign, type } = this.props

    if (isJustGiving() && type !== 'individual') {
      fetchTeams({ campaign, limit: 1000 })
        .then(teams => teams.map(deserializeTeam))
        .then(teams =>
          teams.map(team => ({
            ...team,
            defaultImage:
              team.image ||
              'https://assets.blackbaud-sites.com/images/supporticon/user.svg',
            Link: team.url,
            owner: team.leader,
            pageId: team.id,
            pageShortName: team.slug,
            raisedAmount: team.raised,
            title: team.name,
            type: 'team'
          }))
        )
        .then(teams => this.setState({ teams }))
    }
  }

  handleFetch (params) {
    if (isJustGiving()) {
      const handleFetchTeams = () =>
        Promise.resolve(
          this.state.teams.filter(
            team =>
              team.name.toLowerCase().indexOf(params.q.toLowerCase()) !== -1
          )
        )

      switch (params.type) {
        case 'team':
          return handleFetchTeams()
        case 'all':
          return Promise.all([fetchPages(params), handleFetchTeams()]).then(
            ([pages, teams]) => [...pages, ...teams]
          )
        default:
          return fetchPages(params)
      }
    }

    return fetchPages(params)
  }

  sendQuery (query) {
    if (!query) {
      return this.setState({
        q: null,
        status: 'inactive',
        data: []
      })
    }

    this.setState({
      q: query,
      status: 'fetching'
    })

    return this.handleFetch({
      q: query,
      campaign: this.props.campaign,
      charity: this.props.charity,
      event: this.props.event,
      country: this.props.country,
      type: this.props.type,
      group: this.props.group,
      limit: this.props.limit,
      page: this.props.page
    })
      .then(data => {
        this.setState({
          status: 'fetched',
          data: data.map(this.props.deserializeMethod || deserializePage)
        })
      })
      .catch(error => {
        this.setState({
          status: 'failed'
        })
        return Promise.reject(error)
      })
  }

  getSubtitle (subtitle, page) {
    switch (typeof subtitle) {
      case 'function':
        return subtitle(page)
      default:
        return page[subtitle] ? page[subtitle] : null
    }
  }

  render () {
    return (
      <SearchForm
        onChange={this.sendQuery}
        children={this.state.status !== 'inactive' && this.renderResults()}
        button={this.props.button}
        {...this.props.searchForm}
      />
    )
  }

  renderResults () {
    const { status, q, data = [] } = this.state
    const { subtitle } = this.props

    return (
      <SearchResults
        loading={status === 'fetching'}
        error={status === 'failed'}
        emptyLabel={`No results found for "${q}"`}
        {...this.props.searchResults}
      >
        {data.map((page, i) => (
          <SearchResult
            key={i}
            title={page.name}
            subtitle={this.getSubtitle(subtitle, page)}
            image={page.image}
            url={page.url}
            {...this.props.searchResult}
          />
        ))}
      </SearchResults>
    )
  }
}

PageSearch.propTypes = {
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
   * The event id
   */
  event: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),

  /**
   * The type of page to include in the leaderboard
   */
  type: PropTypes.oneOf(['individual', 'team', 'all']),

  /**
   * The group value(s) to filter by
   */
  group: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),

  /**
   * The number of records to fetch
   */
  limit: PropTypes.number,

  /**
   * The page to fetch
   */
  page: PropTypes.number,

  /**
   * Override the deserializePage method
   */
  deserializeMethod: PropTypes.func,

  /**
   * What to use as the subtitle on the results
   */
  subtitle: PropTypes.oneOfType([PropTypes.string, PropTypes.func]),

  /**
   * Props to be passed to the SearchForm component
   */
  searchForm: PropTypes.object,

  /**
   * Props to be passed to the SearchResults component
   */
  searchResults: PropTypes.object,

  /**
   * Props to be passed to the SearchResult components
   */
  searchResult: PropTypes.object,

  /**
   * Props to be passed to the Button components
   */
  button: PropTypes.object
}

PageSearch.defaultProps = {
  limit: 10,
  type: 'individual',
  subtitle: 'charity'
}

export default PageSearch
