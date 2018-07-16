import React, { Component } from 'react'
import PropTypes from 'prop-types'
import withStyles from 'constructicon/with-styles'
import styles from './styles'
import { deserializeAddress, getAddressDetails, searchAddress } from '../../api/address'
import countries from '../../utils/countries'

import AddressResult from './AddressResult'
import InputSelect from 'constructicon/input-select'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import InputSearch from 'constructicon/input-search'

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
      .then((results) => this.setState({ results, status: 'fetched' }))
      .catch((error) => {
        this.setState({ status: 'failed' })
        return Promise.reject(error)
      })
  }

  handleSelect (selected) {
    this.setState({ value: selected && selected.label })

    if (selected && selected.id) {
      getAddressDetails(selected.id, this.state.country)
        .then((address) => deserializeAddress(address))
        .then((address) => this.props.onChange(address, this.state.country))
    }
  }

  render () {
    const {
      error,
      inputProps,
      validations
    } = this.props

    const {
      country,
      results,
      status,
      value
    } = this.state

    return (
      <Grid spacing={{ x: 0.5 }}>
        <GridColumn md={4}>
          <InputSelect
            label='Country'
            onBlur={(country) => this.setState({ country })}
            onChange={(country) => this.setState({ country })}
            options={countries}
            value={country}
          />
        </GridColumn>
        <GridColumn md={8}>
          <InputSearch
            autoComplete='nope'
            error={error}
            label={this.renderLabel()}
            onChange={this.handleSelect}
            onSearch={this.handleQuery}
            ResultComponent={AddressResult}
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
    const { classNames, onCancel } = this.props

    return (
      <div>
        <span>Address - </span>
        <span
          className={classNames.cancel}
          onClick={onCancel}>Enter address manually
        </span>
      </div>
    )
  }
}

AddressSearch.propTypes = {
  /**
  * Country for API queries
  */
  country: PropTypes.oneOf([ 'au', 'nz', 'uk', 'us', 'ie' ]),

  /**
  * The props to pass to the input search component
  */
  inputProps: PropTypes.object,

  /**
  * The onCancel function to call when the user wants to enter address manually
  */
  onCancel: PropTypes.func.required,

  /**
  * The onChange function to call when a selection is made
  */
  onChange: PropTypes.func.required
}

export default withStyles(styles)(AddressSearch)
