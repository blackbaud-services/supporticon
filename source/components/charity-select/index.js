import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { fetchCharities } from '../../api/charities'

import InputSelect from 'constructicon/input-select'

class CharitySelect extends Component {
  constructor (props) {
    super(props)

    this.state = {
      results: [],
      status: null
    }
  }

  componentDidMount () {
    const { campaign } = this.props

    Promise.resolve()
      .then(() => this.setState({ status: 'fetching' }))
      .then(() => fetchCharities({ campaign }))
      .then(results => results.map(this.deserializeCharity))
      .then(results => this.setState({ results, status: 'fetched' }))
      .catch(error => {
        this.setState({ status: 'failed' })
        return Promise.reject(error)
      })
  }

  deserializeCharity (charity) {
    return {
      label: charity.name,
      value: charity.id
    }
  }

  render () {
    const { inputProps } = this.props
    const { results } = this.state

    return (
      <InputSelect
        options={[{ label: 'Please select', value: '' }, ...results]}
        {...inputProps}
      />
    )
  }
}

CharitySelect.propTypes = {
  /**
   * Only show charities in this campaign
   */
  campaign: PropTypes.string,

  /**
   * The props to be passed to the input select component
   */
  inputProps: PropTypes.object
}

export default CharitySelect
