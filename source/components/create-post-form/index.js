import React from 'react'
import PropTypes from 'prop-types'
import withForm from 'constructicon/with-form'
import get from 'lodash/get'
import form from './form'
import { createPost } from '../../api/posts'
import { uploadToFilestack } from 'constructicon/lib/filestack'

import Form from 'constructicon/form'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import InputField from 'constructicon/input-field'
import InputImage from 'constructicon/input-image'
import InputModal from './InputModal'
import InputVideo from 'constructicon/input-video'
import Section from 'constructicon/section'

class CreatePostForm extends React.Component {
  constructor () {
    super()
    this.handleSubmit = this.handleSubmit.bind(this)
    this.state = {
      errors: [],
      image: null,
      status: null,
      video: null
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

  handleChangeAttachment (val, field = 'image') {
    const { form } = this.props

    if (!val) {
      this.setState({ [field]: null })
      return form.fields[field].onChange('')
    }

    switch (typeof val) {
      case 'object':
        return this.setState({ [field]: val })
      default:
        return form.fields[field].onChange(val)
    }
  }

  render () {
    const { errors, image, status, video } = this.state
    const { buttonProps, form, formProps, inputProps, submit } = this.props

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
        <Section tag='fieldset' spacing={{ b: 1 }}>
          <Grid spacing={0.5}>
            <GridColumn sm={6}>
              <InputModal
                buttonProps={buttonProps}
                data={image ? { image, preview: form.values.image } : null}
                type='image'
              >
                <InputImage
                  {...inputProps}
                  {...form.fields.image}
                  width={1200}
                  height={900}
                  onChange={val => this.handleChangeAttachment(val, 'image')}
                  onFileChange={val =>
                    this.handleChangeAttachment(val, 'image')
                  }
                />
              </InputModal>
            </GridColumn>
            <GridColumn sm={6}>
              <InputModal
                buttonProps={buttonProps}
                data={video}
                type='video'
                width={20}
              >
                <InputVideo
                  {...inputProps}
                  {...form.fields.video}
                  onChange={val => this.handleChangeAttachment(val, 'video')}
                  onVideoChange={val =>
                    this.handleChangeAttachment(val, 'video')
                  }
                />
              </InputModal>
            </GridColumn>
          </Grid>
        </Section>
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
   * Props to be passed to the Button component
   */
  buttonProps: PropTypes.object,

  /**
   * Props to be passed to the Card component
   */
  cardProps: PropTypes.object,

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
