import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  deserializeAddress,
  getAddressDetails,
  searchAddress
} from '../../api/address'
import countries from '../../utils/countries'

import Button from 'constructicon/button'
import InputSelect from 'constructicon/input-select'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import InputSearch from 'constructicon/input-search'
import Section from 'constructicon/section'

class AddressSearch extends Component {
  constructor (props) {
    super(props)
    this.handleQuery = this.handleQuery.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.state = {
      country: props.country,
      results: [],
      status: null,
      value: null
    }
  }

  handleQuery (q) {
    Promise.resolve()
      .then(() => this.setState({ status: 'fetching' }))
      .then(() => searchAddress(q, this.state.country))
      .then(results => this.setState({ results, status: 'fetched' }))
      .catch(error => {
        this.setState({ status: 'failed' })
        return Promise.reject(error)
      })
  }

  handleSelect (selected) {
    this.setState({ value: selected && selected.label })
    if (selected && selected.id) {
      getAddressDetails(selected.id, this.state.country)
        .then(address => deserializeAddress(address))
        .then(address => {
          address.country = this.state.country
          this.props.onChange(address)
        })
    }
  }

  render () {
    const { error, inputProps, validations } = this.props

    const { country, results, status, value } = this.state

    return (
      <Grid spacing={{ x: 0.5 }}>
        {!this.props.country && (
          <GridColumn md={4}>
            <InputSelect
              label='Country'
              name='address-country'
              onBlur={country => this.setState({ country })}
              onChange={country => this.setState({ country })}
              options={countries}
              value={country}
            />
          </GridColumn>
        )}
        <GridColumn md={this.props.country ? 12 : 8}>
          <InputSearch
            autoComplete='nope'
            error={error}
            label={this.renderLabel()}
            onChange={this.handleSelect}
            onSearch={this.handleQuery}
            results={results}
            status={status}
            validations={validations}
            value={value}
            {...inputProps}
          />
        </GridColumn>
      </Grid>
    )
  }

  renderLabel () {
    const { onCancel, onCancelLabel, required } = this.props

    return (
      <Grid spacing={{ x: 0.5 }}>
        <GridColumn xs={5}>
          <span>Address</span>
          {required && (
            <Section foreground='danger' spacing={0} tag='span'>
              *
            </Section>
          )}
        </GridColumn>
        {onCancel && (
          <GridColumn xs={7} xsAlign='right'>
            <Button
              background='transparent'
              borderWidth={0}
              foreground='inherit'
              onClick={onCancel}
              size={-1.5}
              spacing={0}
            >
              {onCancelLabel}
            </Button>
          </GridColumn>
        )}
      </Grid>
    )
  }
}

AddressSearch.propTypes = {
  /**
   * Country for API queries
   */
  country: PropTypes.oneOf(['au', 'nz', 'uk', 'us', 'ie']),

  /**
   * The props to pass to the input search component
   */
  inputProps: PropTypes.object,

  /**
   * The onCancel function to call when the user wants to enter address manually
   */
  onCancel: PropTypes.func,

  /**
   * The text label from the 'Enter manually' button
   */
  onCancelLabel: PropTypes.string,

  /**
   * The onChange function to call when a selection is made
   */
  onChange: PropTypes.func.isRequired
}

AddressSearch.defaultProps = {
  onCancelLabel: 'Enter manually'
}

export default AddressSearch
