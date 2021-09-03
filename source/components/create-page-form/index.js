import React, { Component } from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import merge from 'lodash/merge'
import pickBy from 'lodash/pickBy'
import withForm from 'constructicon/with-form'
import * as validators from 'constructicon/lib/validators'
import { createPage } from '../../api/pages'
import { updateCurrentUser } from '../../api/me'
import { currencyCode } from '../../utils/currencies'
import { renderInput, renderFormFields } from '../../utils/form'
import countries from '../../utils/countries'
import * as addressHelpers from '../../utils/address'

import AddressSearch from '../address-search'
import CharitySearch from '../charity-search'
import Form from 'constructicon/form'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import InputField from 'constructicon/input-field'
import InputSelect from 'constructicon/input-select'
import RichText from 'constructicon/rich-text'

class CreatePageForm extends Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleAddressLookup = this.handleAddressLookup.bind(this)
    this.state = {
      manualAddress: false,
      status: 'empty',
      errors: []
    }
  }

  componentDidMount () {
    if (this.props.country !== 'uk') {
      this.setState({ manualAddress: true })
    }
  }

  handleSubmit (e) {
    e.preventDefault()

    const {
      authType,
      campaignId,
      charityFunded,
      charityId,
      country,
      eventId,
      form,
      onSubmitError,
      onSuccess,
      showValidationErrorMessage,
      timeBox,
      token
    } = this.props

    return form
      .submit()
      .then(data => {
        this.setState({
          errors: [],
          status: 'fetching'
        })

        const addressFields = {
          streetAddress: data.streetAddress,
          extendedAddress: data.extendedAddress,
          locality: data.localityAddress,
          region: data.regionAddress,
          postCode: data.postCodeAddress,
          country: data.countryAddress
        }

        const dataPayload = merge(
          {
            authType,
            campaignId,
            charityFunded,
            charityId,
            charityOptIn: true,
            eventId,
            token,
            timeBox,
            currency: currencyCode(country)
          },
          data
        )

        return Promise.resolve()
          .then(() => this.handleSubmitAddress(token, addressFields))
          .then(() => createPage(dataPayload))
          .then(result => {
            this.setState({ status: 'fetched' })
            return onSuccess(result, dataPayload)
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
                const getErrorMessage = () => {
                  const errorId = get(error, 'data.error.id')

                  switch (errorId) {
                    case 'CampaignNotFound':
                      return 'Campaign not found'
                    case 'CampaignExpired':
                      return 'Campaign has expired'
                    case 'CampaignFundraisingDisabled':
                      return 'Campaign has not enabled fundraising'
                    case 'CampaignInvalidCharityId':
                      return 'Charity is not part of the campaign'
                    case 'CampaignMismatchEventId':
                      return 'Event and Campaign do not match'
                    default:
                      return (
                        get(error, 'data.error.message') ||
                        get(error, 'data.errorMessage') ||
                        'There was an unexpected error'
                      )
                  }
                }

                const message = getErrorMessage()

                return this.setState({
                  status: 'failed',
                  errors: message ? [{ message }] : []
                })
            }
          })
      })
      .catch(error => {
        onSubmitError(error)

        if (showValidationErrorMessage && form.invalid) {
          this.handleValidationErrors(error)
        }
      })
  }

  handleValidationErrors (errors) {
    const fieldErrors = Object.keys(errors)
      .map(key => ({
        key,
        message: Array.isArray(errors[key]) ? errors[key].join(' ') : null
      }))
      .filter(field => !!field.message)
      .filter(field => field.message !== 'This field is required')

    const handleErrorClick = id => {
      const el = document.querySelector(`form [name="${id}"]`)

      if (el) {
        el.focus()
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
      }
    }

    this.setState({
      status: 'failed',
      errors: [
        {
          message: (
            <RichText>
              <p>
                <strong>Please fix the following errors:</strong>
              </p>
              <ul>
                {fieldErrors.map((error, index) => (
                  <li key={index} onClick={() => handleErrorClick(error.key)}>
                    {error.message}
                  </li>
                ))}
              </ul>
            </RichText>
          )
        }
      ]
    })
  }

  handleSubmitAddress (token, address) {
    const { authType, includeAddress, user } = this.props
    const { uuid, email } = user

    return includeAddress
      ? updateCurrentUser({ uuid, email, authType, token, address })
      : Promise.resolve()
  }

  handleAddressLookup (address) {
    const addressFields = pickBy({
      streetAddress: address.streetAddress,
      extendedAddress: address.extendedAddress,
      localityAddress: address.locality,
      regionAddress: address.region,
      postCodeAddress: address.postCode,
      countryAddress: address.country
    })

    this.props.form.updateValues(addressFields)
    this.setState({ manualAddress: true })
  }

  getAutoRenderedFields (fields) {
    return renderFormFields(fields, [
      'streetAddress',
      'extendedAddress',
      'localityAddress',
      'regionAddress',
      'postCodeAddress',
      'countryAddress'
    ])
  }

  render () {
    const {
      campaignId,
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
            case 'charityId':
              return (
                <CharitySearch
                  key={field.name}
                  campaign={campaignId}
                  onChange={charity => field.onChange(charity.id)}
                  inputProps={{ ...field, ...inputField }}
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
    const {
      addressSearchLabel,
      addressSearchProps,
      form,
      inputField,
      country
    } = this.props
    const selectedCountry = form.values.country || country

    if (!manualAddress) {
      return (
        <AddressSearch
          country={country}
          error={form.fields.streetAddress.error}
          onCancel={() => this.setState({ manualAddress: true })}
          onChange={this.handleAddressLookup}
          inputProps={inputField}
          label={addressSearchLabel}
          required
          touched={form.fields.streetAddress.touched}
          validations={form.fields.streetAddress.validations}
          {...addressSearchProps}
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
          <InputField
            {...form.fields.localityAddress}
            {...inputField}
            required={selectedCountry !== 'nz'}
            label={addressHelpers.localityLabel(selectedCountry)}
          />
        </GridColumn>
        <GridColumn md={country ? 6 : 4}>
          <InputField
            {...form.fields.regionAddress}
            {...inputField}
            label={addressHelpers.regionLabel(selectedCountry)}
          />
        </GridColumn>
        {!country && (
          <GridColumn md={4}>
            <InputSelect {...form.fields.countryAddress} {...inputField} />
          </GridColumn>
        )}
        <GridColumn md={country ? 6 : 4}>
          <InputField
            {...form.fields.postCodeAddress}
            {...inputField}
            label={addressHelpers.postCodeLabel(selectedCountry)}
          />
        </GridColumn>
      </Grid>
    )
  }
}

CreatePageForm.propTypes = {
  /**
   * Label for address search field
   */
  addressSearchLabel: PropTypes.string,

  /**
   * Props to spread onto the address search
   */
  addressSearchProps: PropTypes.object,

  /**
   * The campaignId for a valid campaign
   */
  campaignId: PropTypes.string,

  /**
   * The charityId for a valid charity
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
   * The eventId for a valid event
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
   * Callback for when form validation fails
   */
  onSubmitError: PropTypes.func,

  /**
   * The onSuccess event handler
   */
  onSuccess: PropTypes.func.isRequired,

  /**
   * Show form validation errors on submit?
   */
  showValidationErrorMessage: PropTypes.bool,

  /**
   * The label for the form submit button
   */
  submit: PropTypes.string,

  /**
   * Timebox to be applied to page tags
   */
  timeBox: PropTypes.object,

  /**
   * The logged in users' auth token
   */
  token: PropTypes.string.isRequired,

  /**
   * Include a charity search field?
   */
  includeCharitySearch: PropTypes.bool,

  /**
   * Include address search in the page creation
   */
  includeAddress: PropTypes.bool,

  /**
   * Provide initial values for any fields
   */
  initialValues: PropTypes.object,

  /**
   * Additional user data to pass to update user method
   */
  user: PropTypes.object
}

CreatePageForm.defaultProps = {
  authType: 'Basic',
  charityFunded: false,
  disableInvalidForm: false,
  fields: {},
  initialValues: {},
  onSubmitError: () => {},
  submit: 'Create Page',
  user: {}
}

const form = props => {
  const defaultFields = {
    title: {
      label: 'Page title',
      type: 'text',
      order: 1,
      required: true,
      maxLength: 255,
      placeholder: 'Title of your fundraising page',
      validators: [validators.required('Please enter a page title')]
    }
  }

  const optionalFields = {
    ...(props.includeCharitySearch && {
      charityId: {
        label: 'Charity',
        type: 'search',
        order: 2,
        required: true,
        validators: [validators.required('Please select your charity')]
      }
    }),
    ...(props.includeAddress && {
      countryAddress: {
        label: 'Country',
        initial: props.country,
        options: countries,
        required: true,
        placeholder: 'Select Country',
        validators: [validators.required('Please select a country')]
      },
      streetAddress: {
        label: 'Street Address',
        required: true,
        validators: [validators.required('Please enter a street address')]
      },
      extendedAddress: {},
      localityAddress: {
        required: true,
        validators: [
          (val, { country }) =>
            country !== 'nz' &&
            validators.required(
              `Please enter a ${addressHelpers
                .localityLabel(country)
                .toLowerCase()}`
            )(val)
        ]
      },
      regionAddress: {
        required: true,
        validators: [
          (val, { country }) =>
            validators.required(
              `Please enter a ${addressHelpers
                .regionLabel(country)
                .toLowerCase()}`
            )(val)
        ]
      },
      postCodeAddress: {
        required: true,
        validators: [
          (val, { country }) =>
            validators.required(
              `Please enter a ${addressHelpers
                .postCodeLabel(country)
                .toLowerCase()}`
            )(val)
        ]
      }
    })
  }

  const allFields = merge(defaultFields, optionalFields, props.fields)

  const allFieldsWithValues = Object.keys(props.initialValues).reduce(
    (fields, key) => {
      if (!fields[key]) return fields

      return {
        ...fields,
        [key]: {
          ...fields[key],
          initial: props.initialValues[key]
        }
      }
    },
    allFields
  )

  return {
    fields: allFieldsWithValues
  }
}

export default withForm(form)(CreatePageForm)
