import React, { Component } from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import merge from 'lodash/merge'
import withForm from 'constructicon/with-form'
import * as validators from 'constructicon/lib/validators'
import { signUp } from '../../api/authentication'
import { isJustGiving } from '../../utils/client'

import Form from 'constructicon/form'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import Heading from 'constructicon/heading'
import InputField from 'constructicon/input-field'
import InputSelect from 'constructicon/input-select'

class SignupForm extends Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      status: 'empty',
      errors: []
    }
  }

  handleSubmit (e) {
    e.preventDefault()

    const {
      clientId,
      country,
      form,
      onSuccess
    } = this.props

    return form.submit().then((data) => {
      this.setState({
        errors: [],
        status: 'fetching'
      })

      const dataPayload = isJustGiving() ? {
        address: {
          line1: data.line1,
          line2: data.line2,
          townOrCity: data.townOrCity,
          countyOrState: data.countyOrState,
          country: data.country,
          postcodeOrZipcode: data.postcodeOrZipcode
        },
        title: 'Other',
        ...data
      } : {
        clientId,
        country,
        name: [data.firstName, data.lastName].join(' '),
        ...data
      }

      return signUp(dataPayload).then((result) => {
        this.setState({ status: 'fetched' })

        return onSuccess(result)
      }).catch((error) => {
        switch (error.status) {
          case 422:
            const errors = get(error, 'data.error.errors') || []

            return this.setState({
              status: 'failed',
              errors: errors.map(({ field, message }) => ({ message: [capitalize(field), message].join(' ') }))
            })
          default:
            const message = get(error, 'data.error.message') || get(error, 'data.errorMessage')

            return this.setState({
              status: 'failed',
              errors: message ? [{ message }] : []
            })
        }
      })
    })
  }

  render () {
    const {
      country,
      disableInvalidForm,
      form,
      formComponent,
      grid,
      gridColumn,
      inputField,
      legend,
      submit
    } = this.props

    const {
      status,
      errors
    } = this.state

    return (
      <Form
        errors={errors}
        isDisabled={disableInvalidForm && form.invalid}
        isLoading={status === 'fetching'}
        noValidate
        onSubmit={this.handleSubmit}
        submit={submit}
        autoComplete='off'
        {...formComponent}>

        <Grid spacing={{ x: 0.5 }} {...grid}>
          <GridColumn sm={6} {...gridColumn}>
            <InputField {...form.fields.firstName} {...inputField} />
          </GridColumn>
          <GridColumn sm={6} {...gridColumn}>
            <InputField {...form.fields.lastName} {...inputField} />
          </GridColumn>
        </Grid>

        <InputField {...form.fields.email} {...inputField} />
        <InputField {...form.fields.password} {...inputField} />

        {isJustGiving() ? (
          <fieldset>
            <Heading tag='legend' {...legend}>Address</Heading>
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
                <InputField {...form.fields.postcodeOrZipcode} {...inputField} />
              </GridColumn>
            </Grid>
          </fieldset>
        ) : country ? (
          <InputField {...form.fields.phone} {...inputField} />
        ) : (
          <Grid spacing={{ x: 0.5 }} {...grid}>
            <GridColumn sm={7} {...gridColumn}>
              <InputField {...form.fields.phone} {...inputField} />
            </GridColumn>
            <GridColumn sm={5} {...gridColumn}>
              <InputSelect {...form.fields.country} {...inputField} />
            </GridColumn>
          </Grid>
        )}
      </Form>
    )
  }
}

SignupForm.propTypes = {
  /**
  * The clientId for a valid OauthApplication (EDH only)
  */
  clientId: PropTypes.string,

  /**
  * Country for new user (EDH only)
  */
  country: PropTypes.oneOf([ 'au', 'nz', 'uk', 'us', 'ie' ]),

  /**
  * Disable form submission when invalid
  */
  disableInvalidForm: PropTypes.bool,

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
  * The label for the form submit button
  */
  submit: PropTypes.string
}

SignupForm.defaultProps = {
  disableInvalidForm: false,
  submit: 'Sign Up',
  legend: {
    size: 0.5,
    color: 'primary'
  }
}

const form = (props) => ({
  fields: merge({
    firstName: {
      label: 'First name',
      type: 'text',
      required: true,
      maxLength: 30,
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
        validators.greaterThan(7, 'Must be at least 8 characters')
      ]
    }
  },
  isJustGiving() ? {
    line1: {
      label: 'Street address',
      type: 'text',
      required: true,
      validators: [
        validators.required('Please enter your street address')
      ]
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
      validators: [
        validators.required('Please select a country')
      ],
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
      validators: [
        validators.required('Please enter your postcode / zip')
      ]
    }
  } : {
    phone: {
      label: 'Phone Number',
      type: 'tel',
      required: true,
      validators: [
        validators.required('Please enter your phone number'),
        validators.phone('Please enter your 10 digit phone number beginning with a zero')
      ]
    }
  }, !isJustGiving() && !props.country ? {
    country: {
      label: 'Country',
      type: 'select',
      required: true,
      validators: [
        validators.required('Please select a country')
      ],
      options: [
        {
          label: 'Select a country',
          value: '',
          disabled: true
        },
        {
          label: 'Australia',
          value: 'au'
        },
        {
          label: 'New Zealand',
          value: 'nz'
        },
        {
          label: 'United States',
          value: 'us'
        },
        {
          label: 'United Kingdom',
          value: 'uk'
        },
        {
          label: 'Ireland',
          value: 'ie'
        }
      ]
    }
  } : {})
})

export default withForm(form)(SignupForm)
