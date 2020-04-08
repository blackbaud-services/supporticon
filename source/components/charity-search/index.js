import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { deserializeCharity, searchCharities } from '../../api/charities'

import CharityResult from './CharityResult'
import InputSearch from 'constructicon/input-search'

class CharitySearch extends Component {
  constructor (props) {
    super(props)
    this.handleQuery = this.handleQuery.bind(this)
    this.handleSelect = this.handleSelect.bind(this)

    this.state = {
      results: [],
      status: null,
      value: null
    }
  }

  handleQuery (q) {
    const { campaign, country } = this.props

    Promise.resolve()
      .then(() => this.setState({ status: 'fetching' }))
      .then(() => searchCharities({ campaign, country, q }))
      .then(results => results.map(deserializeCharity))
      .then(results => this.setState({ results, status: 'fetched' }))
      .catch(error => {
        this.setState({ status: 'failed' })
        return Promise.reject(error)
      })
  }

  handleSelect (selected = {}) {
    this.setState({ value: selected.name })

    if (selected.id) {
      this.props.onChange(selected)
    }
  }

  render () {
    const { inputProps, ResultComponent } = this.props
    const { results, status, value } = this.state

    return (
      <InputSearch
        {...inputProps}
        autoComplete='off'
        onChange={this.handleSelect}
        onSearch={this.handleQuery}
        ResultComponent={ResultComponent}
        results={results}
        status={status}
        value={value}
      />
    )
  }
}

CharitySearch.propTypes = {
  /**
   * Only show charities in this country
   */
  country: PropTypes.oneOf(['au', 'nz', 'uk', 'us', 'ie']),

  /**
   * Only show charities in this campaign
   */
  campaign: PropTypes.oneOf([PropTypes.string, PropTypes.array]),

  /**
   * The props to be passed to the input search component
   */
  inputProps: PropTypes.object,

  /**
   * The callback to call when a selection is made
   */
  onChange: PropTypes.func,

  /**
   * The component to render the search results
   */
  ResultComponent: PropTypes.oneOfType([PropTypes.node, PropTypes.func])
}

CharitySearch.defaultProps = {
  ResultComponent: CharityResult
}

export default CharitySearch
