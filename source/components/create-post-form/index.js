import React from 'react'
import PropTypes from 'prop-types'
import withForm from 'constructicon/with-form'
import get from 'lodash/get'
import form from './form'
import { createPost } from '../../api/posts'
import { uploadToFilestack } from 'constructicon/lib/filestack'

import Form from 'constructicon/form'
import InputField from 'constructicon/input-field'
import InputImage from 'constructicon/input-image'

class CreatePostForm extends React.Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      errors: [],
      status: null
    }
  }

  handleSubmit (e) {
    e.preventDefault()

    const { form, onSuccess, pageId, token, userId } = this.props

    form.submit().then(data =>
      Promise.resolve()
        .then(() => this.setState({ status: 'fetching' }))
        .then(() => data.image && uploadToFilestack(data.image, pageId))
        .then(image => createPost({ ...data, image, pageId, token, userId }))
        .then(data => {
          this.setState({ status: 'fetched' })
          onSuccess(data)
        })
        .catch(error => {
          const message =
            get(error, 'data.error.message') ||
            get(error, 'data.errorMessage') ||
            get(error, 'message') ||
            'There was an unexpected error'
          this.setState({ status: 'failed', errors: [{ message }] })
        })
    )
  }

  render () {
    const { errors, status } = this.state
    const { form, formProps, inputProps, submit } = this.props

    return (
      <Form
        errors={errors}
        isLoading={status === 'fetching'}
        noValidate
        onSubmit={this.handleSubmit}
        submit={submit}
        autoComplete='off'
        {...formProps}
      >
        <InputField {...form.fields.message} {...inputProps} />
        <InputImage {...form.fields.image} />
      </Form>
    )
  }
}

CreatePostForm.defaultProps = {
  onSuccess: () => {},
  submit: 'Post Update'
}

CreatePostForm.propTypes = {
  /**
   * Props to be passed to the Form component
   */
  formProps: PropTypes.object,

  /**
   * Props to be passed to the Input components
   */
  inputProps: PropTypes.object,

  /*
   *
   */
  onSuccess: PropTypes.func,

  /**
   * The page id to create the post for
   */
  pageId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,

  /**
   * The page owner's user token
   */
  token: PropTypes.string.isRequired,

  /**
   * The label for the form submit button
   */
  submit: PropTypes.string,

  /**
   * The page owner id (required for JG)
   */
  userId: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
}

export default withForm(form)(CreatePostForm)
