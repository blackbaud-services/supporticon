import React, { Component } from 'react'
import PropTypes from 'prop-types'
import get from 'lodash/get'
import values from 'lodash/values'
import withForm from 'constructicon/with-form'
import * as validators from 'constructicon/lib/validators'
import { resetPassword } from '../../api/authentication'

import Form from 'constructicon/form'
import InputField from 'constructicon/input-field'

class ResetPasswordForm extends Component {
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
      form,
      onSuccess,
      reference,
      returnTo
    } = this.props

    return form.submit().then((data) => {
      this.setState({
        errors: [],
        status: 'fetching'
      })

      return resetPassword({
        clientId,
        reference,
        returnTo,
        ...data
      }).then((result) => {
        this.setState({ status: 'fetched' })

        return onSuccess(result)
      }).catch((error) => {
        const message = get(error, 'data.error.message')

        switch (error.status) {
          case 400:
          case 404:
            return this.setState({
              status: 'failed',
              errors: [{ message: `No account was found for ${data.email}` }]
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
        submit={submit}>
        {values(form.fields).map((field) => (
          <InputField key={field.name} {...field} />
        ))}
      </Form>
    )
  }
}

ResetPasswordForm.propTypes = {
  /**
  * The clientId for a valid OauthApplication (EDH only)
  */
  clientId: PropTypes.string,

  /**
  * Disable form submission when invalid
  */
  disableInvalidForm: PropTypes.bool,

  /**
  * The onSuccess event handler
  */
  onSuccess: PropTypes.func.isRequired,

  /**
  * The label for the form submit button
  */
  submit: PropTypes.string,

  /**
  * The campaign slug for branding (EDH only)
  */
  reference: PropTypes.string,

  /**
  * The URL to return to after updating password (EDH only)
  */
  returnTo: PropTypes.string
}

ResetPasswordForm.defaultProps = {
  disableInvalidForm: false,
  submit: 'Send reset password instructions'
}

const form = {
  fields: {
    email: {
      label: 'Email address',
      type: 'email',
      validators: [
        validators.required('Email is a required field'),
        validators.email('Must be a valid email')
      ]
    }
  }
}

export default withForm(form)(ResetPasswordForm)
