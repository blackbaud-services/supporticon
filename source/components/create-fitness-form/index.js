import React, { Component } from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import merge from 'lodash/merge'
import withForm from 'constructicon/with-form'
import * as validators from 'constructicon/lib/validators'
import { createFitnessActivity } from '../../api/fitness-activities'
import { isJustGiving } from '../../utils/client'

import Form from 'constructicon/form'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import InputField from 'constructicon/input-field'
import InputSelect from 'constructicon/input-select'

class CreateFitnessForm extends Component {
  constructor (props) {
    super(props)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      status: 'empty',
      errors: []
    }
  }

  handleSubmit (e) {
    e.preventDefault()

    const { pageSlug, pageId, form, onSuccess, token, userId } = this.props

    return form.submit().then(data => {
      this.setState({ errors: [], status: 'fetching' })

      const dataPayload = merge(data, {
        pageId,
        pageSlug,
        token,
        type: isJustGiving()
          ? data.type
          : data.type === 'ride'
            ? 'bike'
            : data.type,
        userId
      })

      return Promise.resolve()
        .then(() => createFitnessActivity(dataPayload))
        .then(result => {
          this.setState({ status: 'fetched' })
          return onSuccess(result, dataPayload)
        })
        .catch(error => {
          const message =
            get(error, 'data.error.message') ||
            get(error, 'data.errorMessage') ||
            get(error, 'message') ||
            'There was an unexpected error'

          return this.setState({
            status: 'failed',
            errors: message ? [{ message }] : []
          })
        })
    })
  }

  render () {
    const {
      disableInvalidForm,
      form,
      formComponent,
      includeCaption,
      includeDate,
      includeDuration,
      includeElevation,
      includeType,
      includeUnit,
      inputField,
      submit
    } = this.props

    const { status, errors } = this.state

    return (
      <Form
        errors={errors}
        isDisabled={disableInvalidForm && form.invalid}
        isLoading={status === 'fetching'}
        noValidate
        onSubmit={this.handleSubmit}
        submit={submit}
        autoComplete='off'
        {...formComponent}
      >
        <Grid spacing={{ x: 0.5 }}>
          {includeUnit ? (
            <GridColumn>
              <Grid spacing={{ x: 0.25 }}>
                <GridColumn xs={7} sm={7.5} md={8} lg={9}>
                  <InputField {...form.fields.distance} {...inputField} />
                </GridColumn>
                <GridColumn xs={5} sm={4.5} md={4} lg={3}>
                  <InputSelect {...form.fields.unit} {...inputField} />
                </GridColumn>
              </Grid>
            </GridColumn>
          ) : (
            <GridColumn>
              <InputField {...form.fields.distance} {...inputField} />
            </GridColumn>
          )}

          {includeDuration && (
            <GridColumn lg={includeElevation ? 6 : 12}>
              <Grid spacing={{ x: 0.25 }}>
                <GridColumn xs={6} sm={6.5} md={7} lg={8}>
                  <InputField {...form.fields.duration} {...inputField} />
                </GridColumn>
                <GridColumn xs={6} sm={5.5} md={5} lg={4}>
                  <InputSelect {...form.fields.durationUnit} {...inputField} />
                </GridColumn>
              </Grid>
            </GridColumn>
          )}

          {includeElevation && (
            <GridColumn lg={includeDuration ? 6 : 12}>
              <Grid spacing={{ x: 0.25 }}>
                <GridColumn xs={7} sm={7.5} md={8} lg={9}>
                  <InputField {...form.fields.elevation} {...inputField} />
                </GridColumn>
                <GridColumn xs={5} sm={4.5} md={4} lg={3}>
                  <InputSelect {...form.fields.elevationUnit} {...inputField} />
                </GridColumn>
              </Grid>
            </GridColumn>
          )}

          {includeType && (
            <GridColumn lg={includeDate ? 6 : 12}>
              <InputSelect {...form.fields.type} {...inputField} />
            </GridColumn>
          )}

          {includeDate && (
            <GridColumn lg={includeType ? 6 : 12}>
              <InputField {...form.fields.startedAt} {...inputField} />
            </GridColumn>
          )}

          {includeCaption && (
            <GridColumn>
              <InputField {...form.fields.caption} {...inputField} />
            </GridColumn>
          )}
        </Grid>
      </Form>
    )
  }
}

CreateFitnessForm.propTypes = {
  /**
   * The ID for a valid page (required - EDH)
   */
  pageId: isJustGiving() ? PropTypes.string : PropTypes.string.isRequired,

  /**
   * The user's guid (required - JG)
   */
  userId: isJustGiving() ? PropTypes.string.isRequired : PropTypes.string,

  /**
   * Units of measurement (Metric or Imperial)
   */
  uom: PropTypes.oneOf(['km', 'mi']),

  /**
   * Disable form submission when invalid
   */
  disableInvalidForm: PropTypes.bool,

  /**
   * The label for required distance value
   */
  distanceLabel: PropTypes.string,

  /**
   * Props to be passed to the Form component
   */
  formComponent: PropTypes.object,

  /**
   * Props to be passed to the InputField components
   */
  inputField: PropTypes.object,

  /**
   * The onSuccess event handler
   */
  onSuccess: PropTypes.func.isRequired,

  /**
   * The label for the form submit button
   */
  submit: PropTypes.string,

  /**
   * The logged in users' auth token
   */
  token: PropTypes.string.isRequired,

  /**
   * The initial selected fitness activity type
   */
  type: PropTypes.oneOf([
    'walk',
    'run',
    'ride',
    'swim',
    'hike',
    'climb',
    'sport'
  ]),

  /**
   * The available fitness activity types
   */
  types: PropTypes.array,

  /**
   * Include elevation in fitness activity
   */
  includeElevation: PropTypes.bool,

  /**
   * Include duration in fitness activity
   */
  includeDuration: PropTypes.bool,

  /**
   * Include date in fitness activity
   */
  includeDate: PropTypes.bool,

  /**
   * Include caption in fitness activity
   */
  includeCaption: PropTypes.bool,

  /**
   * Include distance type
   */
  includeType: PropTypes.bool,

  /**
   * Include distance units
   */
  includeUnit: PropTypes.bool
}

CreateFitnessForm.defaultProps = {
  disableInvalidForm: false,
  distanceLabel: 'Distance',
  includeCaption: true,
  includeDate: true,
  includeElevation: true,
  includeDuration: true,
  includeType: true,
  includeUnit: true,
  submit: 'Log fitness activity',
  type: 'walk',
  types: ['walk', 'run', 'ride', 'swim']
}

const form = props => {
  return {
    fields: merge(
      {
        distance: {
          type: 'number',
          label: props.distanceLabel,
          initial: '0',
          min: 0,
          required: true,
          validators: [
            validators.required(
              `Please enter a ${props.distanceLabel.toLowerCase()}`
            )
          ]
        },
        type: {
          label: 'Activity Type',
          type: 'select',
          initial: props.type,
          options: props.types.map(value => ({
            value,
            label: capitalize(value)
          }))
        }
      },
      {
        ...(props.includeCaption && {
          caption: {
            label: 'Caption',
            type: 'textarea'
          }
        }),
        ...(props.includeDate && {
          startedAt: {
            label: 'Date',
            type: 'date'
          }
        }),
        ...(props.includeUnit && {
          unit: {
            type: 'select',
            label: '​',
            initial: props.uom,
            options: ['km', 'mi'].map(value => ({ value, label: value }))
          }
        }),
        ...(props.includeDuration && {
          duration: {
            type: 'number',
            label: 'Time',
            initial: '0',
            min: 0
          },
          durationUnit: {
            type: 'select',
            label: '​',
            initial: 'minutes',
            options: [
              { value: 'minutes', label: 'mins' },
              { value: 'hours', label: 'hrs' },
              { value: 'days', label: 'days' }
            ]
          }
        }),
        ...(props.includeElevation && {
          elevation: {
            type: 'number',
            label: 'Elevation',
            initial: '0',
            min: 0
          },
          elevationUnit: {
            type: 'select',
            label: '​',
            initial: props.uom === 'mi' ? 'ft' : 'm',
            options: ['m', 'ft'].map(value => ({ value, label: value }))
          }
        })
      }
    )
  }
}

export default withForm(form)(CreateFitnessForm)
