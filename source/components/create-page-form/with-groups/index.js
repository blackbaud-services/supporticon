import React, { Component } from 'react'
import get from 'lodash/get'
import merge from 'lodash/merge'
import startCase from 'lodash/startCase'
import * as validators from 'constructicon/lib/validators'
import { fetchCampaignGroups } from '../../../api/campaigns'
import { isJustGiving } from '../../../utils/client'

import Loading from 'constructicon/loading'
import Metric from 'constructicon/metric'

const withGroups = (ComponentToWrap) => (
  class extends Component {
    constructor (props) {
      super(props)
      this.fetchGroups = this.fetchGroups.bind(this)

      this.state = {
        error: null,
        fields: null,
        isFetched: isJustGiving()
      }
    }

    componentDidMount () {
      if (!isJustGiving()) this.fetchGroups()
    }

    fetchGroups () {
      const { campaignId } = this.props

      fetchCampaignGroups(campaignId).then((groups) => {
        const fields = {}

        if (groups.length) {
          groups.forEach(({ key, label, values }) => {
            const name = startCase(key)
            const options = [
              {
                label: `Select a ${name}`,
                value: '',
                disabled: true
              },
              ...values.map((value) => ({
                label: value,
                value
              }))
            ]

            fields[`group_values_${key}`] = {
              label,
              options,
              type: 'select',
              required: true,
              validators: [
                validators.required(`Please select a ${name}`)
              ]
            }
          })
        }

        return this.setState({
          fields,
          isFetched: true
        })
      }).catch((error) => (
        this.setState({ error: get(error, 'data.error.message') })
      ))
    }

    render () {
      const { error, isFetched } = this.state

      return error ? (
        <Metric
          icon='warning'
          label={error}
        />
      ) : isFetched ? (
        <ComponentToWrap
          {...this.props}
          fields={merge(this.props.fields, this.state.fields)}
        />
      ) : (
        <Loading />
      )
    }
  }
)

export default withGroups
