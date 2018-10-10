import React, { Component } from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import mapKeys from 'lodash/mapKeys'
import merge from 'lodash/merge'
import pick from 'lodash/pick'
import pickBy from 'lodash/pickBy'
import compose from 'constructicon/lib/compose'
import withForm from 'constructicon/with-form'
import * as validators from 'constructicon/lib/validators'
import { createPage } from '../../api/pages'
import { updateCurrentUser } from '../../api/me'
import { isJustGiving } from '../../utils/client'
import { renderInput, renderFormFields } from '../../utils/form'
import withGroups from './with-groups'
import countries from '../../utils/countries'

import AddressSearch from '../address-search'
import Form from 'constructicon/form'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import InputField from 'constructicon/input-field'
import InputSelect from 'constructicon/input-select'
import InputSlug from '../input-slug'

class CreatePageForm extends Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAddressLookup = this.handleAddressLookup.bind(this)
    this.state = {
      manualAddress: false,
      status: 'empty',
      errors: [],
      slugAvailable: false
    }
  }

  handleSubmit (e) {
    e.preventDefault()

    const {
      authType,
      campaignId,
      charityFunded,
      charityId,
      eventId,
      form,
      onSuccess,
      token
    } = this.props

    return form.submit().then(data => {
      if (form.fields.slug && !this.state.slugAvailable) {
        return
      }

      this.setState({
        errors: [],
        status: 'fetching'
      })

      const groupFields = pickBy(data, (value, key) =>
        /^group_values_/.test(key)
      )
      const addressFields = pick(data, [
        'streetAddress',
        'extendedAddress',
        'locality',
        'region',
        'postCode',
        'country'
      ])

      const dataPayload = merge(
        {
          authType,
          campaignId,
          charityFunded,
          charityId,
          charityOptIn: true,
          eventId,
          token,
          groupValues: mapKeys(groupFields, (value, key) =>
            key.replace('group_values_', '')
          )
        },
        data
      )

      return Promise.resolve()
        .then(() => this.handleSubmitAddress(token, addressFields))
        .then(() => this.handleSubmitPhone(token, data.phone))
        .then(() => createPage(dataPayload))
        .then(result => {
          this.setState({ status: 'fetched' })
          return onSuccess(result)
        })
        .catch(error => {
          switch (error.status) {
            case 422:
              const errors = get(error, 'data.error.errors') || []

              return this.setState({
                status: 'failed',
                errors: errors.map(({ field, message }) => ({
                  message: [
                    capitalize(field.split('_').join(' ')),
                    message
                  ].join(' ')
                }))
              })
            case 400:
              const errorMessages = error.data || []

              return this.setState({
                status: 'failed',
                errors: errorMessages.map(({ desc }) => ({
                  message: capitalize(desc)
                }))
              })
            default:
              const message =
                get(error, 'data.error.message') ||
                get(error, 'data.errorMessage') ||
                'There was an unexpected error'

              return this.setState({
                status: 'failed',
                errors: message ? [{ message }] : []
              })
          }
        })
    })
  }

  handleSubmitAddress (token, address) {
    const { authType, includeAddress } = this.props

    return includeAddress
      ? updateCurrentUser({ authType, token, address })
      : Promise.resolve()
  }

  handleSubmitPhone (token, phone) {
    const { authType, includePhone } = this.props

    return !isJustGiving() && includePhone
      ? updateCurrentUser({ authType, token, phone })
      : Promise.resolve()
  }

  handleAddressLookup (address, country) {
    this.props.form.updateValues({ ...address, country })
    this.setState({ manualAddress: true })
  }

  getAutoRenderedFields (fields) {
    return renderFormFields(fields, [
      'streetAddress',
      'extendedAddress',
      'locality',
      'region',
      'postCode',
      'country'
    ])
  }

  render () {
    const {
      disableInvalidForm,
      form,
      formComponent,
      includeAddress,
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
        {this.getAutoRenderedFields(form.fields).map(field => {
          switch (field.name) {
            case 'slug':
              return (
                <InputSlug
                  key={field.name}
                  {...field}
                  {...inputField}
                  handleFetch={slugAvailable =>
                    this.setState({ slugAvailable })
                  }
                />
              )
            default:
              const Tag = renderInput(field.type)
              return <Tag key={field.name} {...field} {...inputField} />
          }
        })}

        {includeAddress && this.renderAddress()}
      </Form>
    )
  }

  renderAddress () {
    const { manualAddress } = this.state
    const { form, inputField, country } = this.props

    if (!manualAddress) {
      return (
        <AddressSearch
          country={country}
          error={form.fields.streetAddress.error}
          onCancel={() => this.setState({ manualAddress: true })}
          onChange={this.handleAddressLookup}
          inputProps={inputField}
          validations={form.fields.streetAddress.validations}
        />
      )
    }

    return (
      <Grid spacing={{ x: 0.5 }}>
        <GridColumn>
          <InputField {...form.fields.streetAddress} {...inputField} />
        </GridColumn>
        <GridColumn>
          <InputField {...form.fields.extendedAddress} {...inputField} />
        </GridColumn>
        <GridColumn>
          <InputField {...form.fields.locality} {...inputField} />
        </GridColumn>
        <GridColumn md={4}>
          <InputField {...form.fields.region} {...inputField} />
        </GridColumn>
        <GridColumn md={4}>
          <InputSelect {...form.fields.country} {...inputField} />
        </GridColumn>
        <GridColumn md={4}>
          <InputField {...form.fields.postCode} {...inputField} />
        </GridColumn>
      </Grid>
    )
  }
}

CreatePageForm.propTypes = {
  /**
   * The campaignId for a valid campaign (EDH only - required)
   */
  campaignId: PropTypes.string,

  /**
   * The charityId for a valid charity (Required for JG)
   */
  charityId: PropTypes.string,

  /**
   * Whether Gift Aid is enabled
   */
  charityFunded: PropTypes.bool,

  /**
   * Country for new page
   */
  country: PropTypes.oneOf(['au', 'nz', 'uk', 'us', 'ie']),

  /**
   * Disable form submission when invalid
   */
  disableInvalidForm: PropTypes.bool,

  /**
   * The eventId for a valid event (JG only - required)
   */
  eventId: PropTypes.string,

  /**
   * Form fields to be passed to withForm config
   */
  fields: PropTypes.object,

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
   * Include phone in page creation
   */
  includePhone: PropTypes.bool,

  /**
   * Include address search in the page creation
   */
  includeAddress: PropTypes.bool
}

CreatePageForm.defaultProps = {
  authType: 'Basic',
  charityFunded: false,
  disableInvalidForm: false,
  fields: {},
  submit: 'Create Page'
}

const form = props => {
  const includePhone = !isJustGiving() && props.includePhone

  const defaultFields = isJustGiving()
    ? {
      title: {
        label: 'Page title',
        type: 'text',
        order: 1,
        required: true,
        maxLength: 255,
        placeholder: 'Title of your fundraising page',
        validators: [validators.required('Please enter a page title')]
      },
      slug: {
        label: 'Page URL',
        type: 'text',
        order: 2,
        required: true,
        maxLength: 255,
        placeholder: 'URL for your fundraising page',
        onKeyDown: e => e.which === 32 && e.preventDefault(),
        validators: [
          validators.required('Please enter your page URL'),
          validators.slug(
            'Please enter a valid URL using only letters, numbers or hyphens (-)'
          )
        ]
      }
    }
    : {
      birthday: {
        label: 'Date of birth',
        type: 'date',
        order: 1,
        required: true,
        placeholder: 'DD/MM/YYYY',
        min: '1900-01-01',
        pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}',
        validators: [validators.required('Please enter your date of birth')]
      }
    }

  const addressFormFields = {
    country: {
      label: 'Country',
      initial: props.country,
      options: countries,
      validators: [validators.required('Please select a country')]
    },
    streetAddress: {
      label: 'Street Address',
      validators: [validators.required('Please enter a street address')]
    },
    extendedAddress: {},
    locality: {
      label: 'Town/Suburb',
      validators: [validators.required('Please enter a town/suburb')]
    },
    region: {
      label: 'State',
      validators: [validators.required('Please enter a state')]
    },
    postCode: {
      label: 'Post Code',
      validators: [validators.required('Please enter a post code')]
    }
  }

  const phoneFields = {
    phone: {
      label: 'Phone Number',
      type: 'tel',
      order: 2,
      required: true,
      validators: [validators.required('Please enter your phone number')]
    }
  }

  return {
    fields: merge(
      defaultFields,
      props.fields,
      props.includeAddress ? addressFormFields : {},
      includePhone ? phoneFields : {}
    )
  }
}

export default compose(
  withGroups,
  withForm(form)
)(CreatePageForm)
