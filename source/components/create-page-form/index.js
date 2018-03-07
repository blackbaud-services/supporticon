import React, { Component } from 'react'
import PropTypes from 'prop-types'
import capitalize from 'lodash/capitalize'
import get from 'lodash/get'
import merge from 'lodash/merge'
import values from 'lodash/values'
import compose from 'constructicon/lib/compose'
import withForm from 'constructicon/with-form'
import * as validators from 'constructicon/lib/validators'
import { createPage } from '../../api/pages'
import { isJustGiving } from '../../utils/client'
import withGroups from './with-groups'

import Form from 'constructicon/form'
import InputDate from 'constructicon/input-date'
import InputField from 'constructicon/input-field'
import InputSelect from 'constructicon/input-select'

class CreatePageForm extends Component {
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
      campaignId,
      charityFunded,
      charityId,
      eventId,
      form,
      onSuccess,
      token
    } = this.props

    return form.submit().then((data) => {
      this.setState({
        errors: [],
        status: 'fetching'
      })

      const dataPayload = merge({
        campaignId,
        charityFunded,
        charityId,
        charityOptIn: true,
        eventId,
        token
      }, data)

      return createPage(dataPayload).then((result) => {
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
          case 400:
            const errorMessages = error.data || []

            return this.setState({
              status: 'failed',
              errors: errorMessages.map(({ desc }) => ({ message: capitalize(desc) }))
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

  renderInput (type) {
    switch (type) {
      case 'date':
        return InputDate
      case 'select':
        return InputSelect
      default:
        return InputField
    }
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
        autoComplete='off'
        {...formComponent}>

        {values(form.fields).map((field) => {
          const Tag = this.renderInput(field.type)
          return <Tag key={field.name} {...field} {...inputField} />
        })}
      </Form>
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
  token: PropTypes.string.isRequired
}

CreatePageForm.defaultProps = {
  charityFunded: false,
  disableInvalidForm: false,
  submit: 'Create Page'
}

const form = (props) => ({
  fields: merge(isJustGiving() ? {
    title: {
      label: 'Page title',
      type: 'text',
      required: true,
      maxLength: 255,
      placeholder: 'Title of your fundraising page',
      validators: [
        validators.required('Please enter a page title')
      ]
    },
    slug: {
      label: 'Page URL',
      type: 'text',
      required: true,
      maxLength: 255,
      placeholder: 'URL for your fundraising page',
      onKeyDown: (e) => e.which === 32 && e.preventDefault(),
      validators: [
        validators.required('Please enter your page URL'),
        validators.slug('Please enter a valid URL using only letters, numbers or hyphens (-)')
      ]
    }
  } : {
    birthday: {
      label: 'Date of birth',
      type: 'date',
      required: true,
      placeholder: 'DD/MM/YYYY',
      min: '1900-01-01',
      pattern: '[0-9]{4}-[0-9]{2}-[0-9]{2}',
      validators: [
        validators.required('Please enter your date of birth')
      ]
    }
  }, props.fields)
})

export default compose(
  withGroups,
  withForm(form)
)(CreatePageForm)
