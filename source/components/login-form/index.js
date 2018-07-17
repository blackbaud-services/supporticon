import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import merge from 'lodash/merge'
import withForm from 'constructicon/with-form'
import * as validators from 'constructicon/lib/validators'
import { signIn } from '../../api/authentication'
import { renderInput, renderFormFields } from '../../utils/form'

import Form from 'constructicon/form'

class LoginForm extends Component {
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

      return signIn({
        clientId,
        country,
        ...data
      }).then((result) => {
        this.setState({ status: 'fetched' })

        return onSuccess(result)
      }).catch((error) => {
        const message = get(error, 'data.error.message')

        switch (error.status) {
          case 401:
          case 404:
            return this.setState({
              status: 'failed',
              errors: [{ message: 'Invalid Email or Password.' }]
            })
          default:
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
      disableInvalidForm,
      form,
      formComponent,
      inputField,
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
        {...formComponent}>

        {renderFormFields(form.fields).map((field) => {
          const Tag = renderInput(field.type)
          return <Tag key={field.name} {...field} {...inputField} />
        })}
      </Form>
    )
  }
}

LoginForm.propTypes = {
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
  * Fields to be passed to the form HOC
  */
  fields: PropTypes.object,

  /**
  * Props to be passed to the Form component
  */
  formComponent: PropTypes.object,

  /**
  * Props to be passed to the InputField component
  */
  inputField: PropTypes.object,

  /**
  * The onSuccess event handler
  */
  onSuccess: PropTypes.func.isRequired,

  /**
  * The label for the form submit button
  */
  submit: PropTypes.string
}

LoginForm.defaultProps = {
  disableInvalidForm: false,
  fields: {},
  submit: 'Log in'
}

const form = (props) => ({
  fields: merge({
    email: {
      label: 'Email address',
      type: 'email',
      order: 1,
      required: true,
      validators: [
        validators.required('Email is a required field'),
        validators.email('Must be a valid email')
      ]
    },
    password: {
      label: 'Password',
      type: 'password',
      order: 2,
      required: true,
      validators: [
        validators.required('Password is a required field'),
        validators.greaterThan(7, 'Must be at least 8 characters')
      ]
    }
  }, props.fields)
})

export default withForm(form)(LoginForm)
