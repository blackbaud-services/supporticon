import React from 'react'
import PropTypes from 'prop-types'
import withForm from 'constructicon/with-form'
import form from './form'
import { getErrorMessage } from '../../utils/errors'
import {
  getConnectUrl,
  listenForPostMessage,
  showPopup
} from '../../utils/oauth'
import { parseUrlParams } from '../../utils/params'
import {
  checkAccountAvailability,
  connectToken
} from '../../api/authentication'

import Button from 'constructicon/button'
import ButtonGroup from 'constructicon/button-group'
import Form from 'constructicon/form'
import Grid from 'constructicon/grid'
import GridColumn from 'constructicon/grid-column'
import Icon from 'constructicon/icon'
import InputField from 'constructicon/input-field'
import Section from 'constructicon/section'

class JGConnectForm extends React.Component {
  constructor () {
    super()
    this.handleClose = this.handleClose.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)
    this.showOAuth = this.showOAuth.bind(this)

    this.state = { errors: [], status: 'empty', confirming: false }
  }

  componentDidMount () {
    const { redirectUri } = this.props
    const data = parseUrlParams()

    listenForPostMessage({ redirectUri, onSuccess: this.handleSuccess })

    if (data.access_token || data.code) {
      return this.handleSuccess(data)
    }
  }

  handleClose () {
    this.setState({ status: 'empty' })
  }

  handleSuccess (data) {
    const { onSuccess } = this.props

    Promise.resolve()
      .then(() => this.setState({ confirming: true }))
      .then(() => connectToken(data))
      .then(data => onSuccess(data))
      .catch(error => {
        const errors = [{ message: getErrorMessage(error) }]
        this.setState({ errors, status: 'failed', confirming: false })
      })
  }

  showOAuth (forceSignUp, email) {
    const { clientId, homeUrl, oauthParams, popup, redirectUri } = this.props

    return Promise.resolve()
      .then(() => this.setState({ status: 'fetching', errors: [] }))
      .then(() =>
        getConnectUrl({
          clientId,
          email,
          forceSignUp,
          homeUrl,
          redirectUri,
          oauthParams
        })
      )
      .then(
        url =>
          popup
            ? showPopup({ url, onClose: this.handleClose })
            : (window.location.href = url)
      )
      .catch(error => {
        const errors = [{ message: getErrorMessage(error) }]
        this.setState({ errors, status: 'failed' })
      })
  }

  render () {
    const { form, label, showButtons } = this.props
    const { confirming, errors, status } = this.state
    const isLoading = confirming || status === 'fetching'

    if (showButtons) {
      return (
        <div>
          <Section spacing={{ b: 0.5 }}>
            {label || 'Do you have an existing JustGiving account?'}
          </Section>
          <ButtonGroup>
            <Button
              background='justgiving'
              foreground='light'
              onClick={() => this.showOAuth(false)}
            >
              {isLoading ? (
                <Icon name='loading' spin />
              ) : (
                <Icon name='justgiving' />
              )}
              <span>Yes, I do</span>
            </Button>
            <Button
              background='justgiving'
              foreground='light'
              onClick={() => this.showOAuth(true)}
            >
              {isLoading ? (
                <Icon name='loading' spin />
              ) : (
                <Icon name='justgiving' />
              )}
              <span>No, I don't</span>
            </Button>
          </ButtonGroup>
        </div>
      )
    }

    return (
      <Form
        errors={errors}
        isLoading={isLoading}
        noValidate
        onSubmit={e => {
          e.preventDefault()

          form.submit().then(values =>
            Promise.resolve()
              .then(() => this.setState({ status: 'fetching', errors: [] }))
              .then(() => checkAccountAvailability(values.email))
              .then(hasAccount => this.showOAuth(!hasAccount, values.email))
          )
        }}
        submit=''
        autoComplete='off'
      >
        <Section spacing={{ b: 0.5 }}>
          <label htmlFor='email'>
            {label ||
              'Enter your email below to check if you have an existing JustGiving account'}
          </label>
        </Section>
        <Grid spacing={{ x: 0.25, y: 0 }}>
          <GridColumn md={9}>
            <InputField {...form.fields.email} />
          </GridColumn>
          <GridColumn md={3}>
            <Button
              block
              background='justgiving'
              foreground='light'
              spacing={{ y: 0.3, x: 1 }}
              type='submit'
            >
              {isLoading ? (
                <Icon name='loading' spin />
              ) : (
                <Icon name='justgiving' />
              )}
              <span>Next</span>
            </Button>
          </GridColumn>
        </Grid>
      </Form>
    )
  }
}

JGConnectForm.propTypes = {
  /**
   * The JG application key
   */
  clientId: PropTypes.string.isRequired,

  /**
   * Home URL that our oauth handler (oauth.blackbaud-sites.com) will redirect to
   */
  homeUrl: PropTypes.string,

  /**
   * The label at the top of the form
   */
  label: PropTypes.string,

  /**
   * Options to customise the oauth flow - see https://github.com/JustGiving/JG.IdentityAndAccess.Sso/blob/master/src/JG.IdentityAndAccess.Sso.Core/IdentityAndAccess/Models/SingleSignOnOptionsModel.cs
   */
  oauthParams: PropTypes.object,

  /**
   * The function to call when user is successfully authenticated
   */
  onSuccess: PropTypes.function,

  /**
   * Use a popup window for OAuth
   */
  popup: PropTypes.bool,

  /**
   * The url to redirect to on successful authentication
   */
  redirectUri: PropTypes.string.isRequired,

  /**
   * Show Yes/No buttons instead of an email check form
   */
  showButtons: PropTypes.bool
}

JGConnectForm.defaultProps = {
  popup: true
}

export default withForm(form)(JGConnectForm)
