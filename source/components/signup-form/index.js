import React, { Component } from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import merge from 'lodash/merge'
import withForm from 'constructicon/with-form'
import * as validators from 'constructicon/lib/validators'
import { signUp } from '../../api/authentication'
import { isStaging } from '../../utils/client'
import { renderInput, renderFormFields } from '../../utils/form'

import Form from 'constructicon/form'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import Heading from 'constructicon/heading'
import Icon from 'constructicon/icon'
import InputField from 'constructicon/input-field'
import InputSelect from 'constructicon/input-select'
import Modal from 'constructicon/modal'
import PasswordValidations from '../password-validations'
import RichText from 'constructicon/rich-text'
import Section from 'constructicon/section'

class SignupForm extends Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      status: 'empty',
      showModal: false,
      errors: []
    }
  }

  handleSubmit (e) {
    e.preventDefault()

    const {
      authType,
      form,
      includeAddress,
      onSuccess,
      loginUrl,
      loginTarget,
      resetPasswordUrl,
      resetPasswordTarget
    } = this.props

    const subdomain = isStaging() ? 'www.staging' : 'www'
    const defaultLoginUrl = `https://${subdomain}.justgiving.com/sso`
    const defaultResetPasswordUrl = `https://${subdomain}.justgiving.com/sso/resetpassword?ReturnUrl=https%3A%2F%2F${subdomain}.justgiving.com%2F&Context=consumer&ActionType=set_profile`

    return form.submit().then(data => {
      this.setState({
        errors: [],
        status: 'fetching'
      })

      const dataPayload = merge(
        {
          authType,
          title: data.title || 'Other',
          ...data
        },
        includeAddress && {
          address: {
            line1: data.line1,
            line2: data.line2,
            townOrCity: data.townOrCity,
            countyOrState: data.countyOrState,
            country: data.country,
            postcodeOrZipcode: data.postcodeOrZipcode
          }
        }
      )

      return signUp(dataPayload)
        .then(onSuccess)
        .then(() => this.setState({ status: 'fetched' }))
        .catch(error => {
          let errors = []
          const message =
            get(error, 'data.error.message') ||
            get(error, 'data.errorMessage')

          const errorStatus = error ? error.status : 500

          switch (errorStatus) {
            case 400:
            case 406:
            case 409:
              errors = get(error, 'data.Errors') || []

              return this.setState({
                status: 'failed',
                errors: errors.map((error, key) => {
                  switch (error.ErrorMessage) {
                    case 'Password must not include email, name, or a commonly used word':
                      return {
                        code: errorStatus,
                        message:
                          'Your password must not include your name or email address'
                      }
                    case 'Sorry something went wrong RALJGU':
                      return {
                        code: errorStatus,
                        message: 'The email domain you have used is not allowed. Please change your email address.'
                      }
                    case 'EmailAddress is in use.':
                      this.setState({ showModal: true })

                      return {
                        field: 'email',
                        message: (
                          <div key={key}>
                            <p>
                              An account already exists for{' '}
                              <strong>{data.email}</strong>.
                            </p>
                            <p>
                              <a
                                href={loginUrl || defaultLoginUrl}
                                target={loginTarget || '_blank'}
                                rel='noreferrer'
                              >
                                Log in here
                              </a>
                              {' or '}
                              <a
                                href={
                                  resetPasswordUrl || defaultResetPasswordUrl
                                }
                                target={resetPasswordTarget || '_blank'}
                                rel='noreferrer'
                              >
                                reset your JustGiving password here.
                              </a>
                            </p>
                          </div>
                        )
                      }
                    default:
                      return { message: error.ErrorMessage, code: errorStatus }
                  }
                })
              })
            case 422:
              errors = get(error, 'data.error.errors') || []

              return this.setState({
                status: 'failed',
                errors: errors.map(({ field, message }, key) => {
                  if (
                    field === 'email' &&
                    message === 'has already been taken'
                  ) {
                    return {
                      message: (
                        <div key={key}>
                          <p>Your password is incorrect.</p>
                          <p>
                            Please try again, or you can{' '}
                            <a
                              href={resetPasswordUrl || defaultResetPasswordUrl}
                              target={resetPasswordTarget || '_blank'}
                              rel='noreferrer'
                            >
                              reset your JustGiving password here.
                            </a>
                          </p>
                        </div>
                      )
                    }
                  }

                  return { message: [capitalize(field), message].join(' ') }
                })
              })
            default:
              if (error && error.data.Errors && Array.isArray(error.data.Errors)) {
                return this.setState({
                  status: 'failed',
                  errors: error.data.Errors.map(error => ({ message: error.ErrorMessage, code: errorStatus }))
                })
              }

              return this.setState({
                status: 'failed',
                errors: message ? [{ message }] : [{ message: 'Sorry something went wrong. Please try again' }]
              })
          }
        })
    })
  }

  customFields (fields) {
    return renderFormFields(fields, [
      'firstName',
      'lastName',
      'email',
      'password',
      'phone',
      'line1',
      'line2',
      'townOrCity',
      'countyOrState',
      'country',
      'postcodeOrZipcode',
      'terms'
    ])
  }

  render () {
    const {
      disableInvalidForm,
      form,
      formComponent,
      grid,
      gridColumn,
      includeAddress,
      includeTerms,
      inputField,
      legend,
      showPasswordValidations,
      submit,
      externalValidationMessages
    } = this.props

    const { status, errors } = this.state
    const externalValidationStyles = { marginTop: '-1.5rem', marginBottom: '1.5rem', display: 'block', fontWeight: 'bold', fontStyle: 'italic' }

    return (
      <Form
        errors={this.state.showModal ? [] : errors}
        icon={
          status === 'fetching'
            ? { name: 'loading', spin: true }
            : { name: 'lock' }
        }
        isDisabled={disableInvalidForm && form.invalid}
        isLoading={status === 'fetching'}
        noValidate
        onSubmit={this.handleSubmit}
        submit={submit}
        autoComplete='off'
        {...formComponent}
      >
        <Grid spacing={{ x: 0.5 }} {...grid}>
          <GridColumn sm={6} {...gridColumn}>
            <InputField {...form.fields.firstName} {...inputField} />
            {externalValidationMessages && externalValidationMessages.firstname ? <span style={externalValidationStyles}>{externalValidationMessages.firstname}</span> : <></>}
          </GridColumn>
          <GridColumn sm={6} {...gridColumn}>
            <InputField {...form.fields.lastName} {...inputField} />
            {externalValidationMessages && externalValidationMessages.lastname ? <span style={externalValidationStyles}>{externalValidationMessages.lastname}</span> : <></>}
          </GridColumn>
        </Grid>

        <InputField
          {...form.fields.email}
          {...inputField}
          onFocus={() => this.setState(oldState => ({ ...oldState, errors: oldState.errors.filter(error => error.code !== 409) }))}
        />
        {externalValidationMessages && externalValidationMessages.email ? <span style={externalValidationStyles}>{externalValidationMessages.email}</span> : <></>}
        <InputField
          {...form.fields.password}
          validations={
            showPasswordValidations ? [] : form.fields.password.validations
          }
          {...inputField}
        />
        {showPasswordValidations && <PasswordValidations form={form} />}

        {includeAddress && (
          <fieldset>
            <Heading tag='legend' {...legend}>
              Address
            </Heading>
            <InputField {...form.fields.line1} {...inputField} />
            <InputField {...form.fields.line2} {...inputField} />
            <Grid spacing={{ x: 0.5 }} {...grid}>
              <GridColumn sm={7} {...gridColumn}>
                <InputField {...form.fields.townOrCity} {...inputField} />
              </GridColumn>
              <GridColumn sm={5} {...gridColumn}>
                <InputField {...form.fields.countyOrState} {...inputField} />
              </GridColumn>
            </Grid>
            <Grid spacing={{ x: 0.5 }} {...grid}>
              <GridColumn sm={8} {...gridColumn}>
                <InputSelect {...form.fields.country} {...inputField} />
              </GridColumn>
              <GridColumn sm={4} {...gridColumn}>
                <InputField
                  {...form.fields.postcodeOrZipcode}
                  {...inputField}
                />
              </GridColumn>
            </Grid>
          </fieldset>
        )}

        {includeTerms && <InputField {...form.fields.terms} {...inputField} />}

        {this.customFields(form.fields).map(field => {
          const Tag = renderInput(field.type)
          return <Tag key={field.name} {...field} {...inputField} />
        })}

        <Modal
          isOpen={this.state.showModal}
          contentLabel='Errors'
          onRequestClose={() => this.setState({ errors: [], showModal: false })}
          width={20}
          styles={{ container: { textAlign: 'center' } }}
        >
          <Section>
            <Icon name='warning' size={3} color='danger' />
          </Section>
          {errors.filter(error => error.field === 'email').map((error, i) => (
            <RichText key={i}>{error.message}</RichText>
          ))}
        </Modal>
      </Form>
    )
  }
}

SignupForm.propTypes = {
  /**
   * Disable form submission when invalid
   */
  disableInvalidForm: PropTypes.bool,

  /**
   * Fields to be passed to the form HOC
   */
  fields: PropTypes.object,

  /**
   * Props to be passed to the Form component
   */
  formComponent: PropTypes.object,

  /**
   * Props to be passed to the Grid components
   */
  grid: PropTypes.object,

  /**
   * Props to be passed to the GridColumn components
   */
  gridColumn: PropTypes.object,

  /**
   * Include address form (JG only)
   */
  includeAddress: PropTypes.bool,

  /**
   * Include terms checkbox
   */
  includeTerms: PropTypes.bool,

  /**
   * Props to be passed to the InputField components
   */
  inputField: PropTypes.object,

  /**
   * Props to be passed to the Heading component used as a form legend
   */
  legend: PropTypes.object,

  /**
   * The onSuccess event handler
   */
  onSuccess: PropTypes.func.isRequired,

  /**
   * Login URL to display on error
   */
  loginUrl: PropTypes.string,

  /**
   * Login Link target (displayed on error)
   */
  loginUrlTarget: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),

  /**
   * Reset password URL to display on error
   */
  resetPasswordUrl: PropTypes.string,

  /**
   * Reset password Link target (displayed on error)
   */
  resetPasswordTarget: PropTypes.oneOf(['_self', '_blank', '_parent', '_top']),

  /**
   * Include JG password validations helper
   */
  showPasswordValidations: PropTypes.bool,

  /**
   * The label for the form submit button
   */
  submit: PropTypes.string,

  /**
   * The initial values for firstname, lastname and emailaddress
   */
  initialValues: PropTypes.object,

  /**
   * Validation messages generated from external sources
   */
  externalValidationMessages: PropTypes.object
}

SignupForm.defaultProps = {
  authType: 'Bearer',
  disableInvalidForm: false,
  fields: {},
  formComponent: {
    submitProps: {
      background: 'justgiving',
      foreground: 'light'
    }
  },
  showPasswordValidations: true,
  submit: 'Sign Up',
  legend: {
    size: 0.5,
    color: 'primary'
  }
}

const form = props => {
  const includeAddress = props.includeAddress
  const includeTerms = props.includeTerms

  const fields = merge(
    {
      firstName: {
        label: 'First name',
        type: 'text',
        required: true,
        maxLength: 30,
        initial: props.initialValues ? props.initialValues.firstname : undefined,
        validators: [
          validators.required('Please enter a first name'),
          validators.alphaNumericSpecial('Please enter a valid first name')
        ]
      },
      lastName: {
        label: 'Last name',
        type: 'text',
        required: true,
        maxLength: 50,
        initial: props.initialValues ? props.initialValues.lastname : undefined,
        validators: [
          validators.required('Please enter a last name'),
          validators.alphaNumericSpecial('Please enter a valid last name')
        ]
      },
      email: {
        label: 'Email address',
        type: 'email',
        required: true,
        autoComplete: 'off',
        initial: props.initialValues ? props.initialValues.email : undefined,
        validators: [
          validators.required('Email is a required field'),
          validators.email('Must be a valid email')
        ]
      },
      password: {
        label: 'Password',
        type: 'password',
        required: true,
        autoComplete: 'off',
        validators: [
          validators.required('Password is a required field'),
          validators.greaterThan(11, 'Must be at least 12 characters'),
          validators.passwordComplexity(),
          validators.doesNotContainField(
            'firstName',
            'Your password must not include your first name'
          ),
          validators.doesNotContainField(
            'lastName',
            'Your password must not include your last name'
          ),
          validators.doesNotContainField(
            'email',
            'Your password must not include your email address'
          )
        ]
      }
    },
    includeAddress && {
      line1: {
        label: 'Street address',
        type: 'text',
        required: true,
        validators: [validators.required('Please enter your street address')]
      },
      line2: {
        label: 'Unit / Townhouse / Level',
        type: 'text'
      },
      townOrCity: {
        label: 'Town / City',
        type: 'text',
        required: true,
        validators: [
          validators.required('Please enter your town, city or locality')
        ]
      },
      countyOrState: {
        label: 'County / State',
        type: 'text'
      },
      country: {
        label: 'Country',
        type: 'select',
        required: true,
        validators: [validators.required('Please select a country')],
        options: [
          {
            label: 'Select a country',
            value: '',
            disabled: true
          },
          {
            label: 'United Kingdom',
            value: 'GB'
          },
          {
            label: 'Ireland',
            value: 'IE'
          },
          {
            label: 'Hong Kong',
            value: 'HK'
          },
          {
            label: 'Australia',
            value: 'AU'
          },
          {
            label: 'United States',
            value: 'US'
          }
        ]
      },
      postcodeOrZipcode: {
        label: 'Postcode',
        type: 'text',
        maxLength: 8,
        required: true,
        validators: [validators.required('Please enter your postcode / zip')]
      }
    },
    includeTerms && {
      terms: {
        label: (
          <span>
            I agree to JustGiving's{' '}
            <a
              target='_blank'
              href='https://www.justgiving.com/info/privacy/'
              rel='noreferrer'
            >
              Privacy Policy
            </a>{' '}
            and{' '}
            <a
              target='_blank'
              href='https://www.justgiving.com/info/terms-of-service/'
              rel='noreferrer'
            >
              Terms of Service
            </a>
          </span>
        ),
        type: 'checkbox',
        required: true,
        validators: [
          validators.required('You must agree to the terms to continue')
        ]
      }
    },
    props.fields
  )

  return { fields }
}

export default withForm(form)(SignupForm)
