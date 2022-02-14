import React, { Component } from 'react'
import PropTypes from 'prop-types'
import URL from 'url-parse'
import omit from 'lodash/omit'
import { base64EncodeParams, parseUrlParams } from '../../utils/params'
import { toPromise } from '../../utils/promise'
import { getBaseURL } from '../../utils/client'
import { connectToken } from '../../api/authentication'
import {
  getLocalStorageItem,
  setLocalStorageItem
} from 'constructicon/lib/localStorage'

import Button from 'constructicon/button'
import Icon from 'constructicon/icon'

class ProviderOauthButton extends Component {
  constructor (props) {
    super(props)
    this.handleAuth = this.handleAuth.bind(this)
    this.handleSuccess = this.handleSuccess.bind(this)
    this.providerUrl = this.providerUrl.bind(this)

    this.state = {
      status: 'empty',
      success: false
    }
  }

  componentWillUnmount () {
    clearInterval(this.localStoragePoll)
    clearInterval(this.isPopupClosed)
  }

  componentDidMount () {
    const {
      onSuccess,
      popup,
      provider,
      redirectUri,
      useLocalStorage
    } = this.props

    const data = parseUrlParams()

    if (popup && typeof onSuccess === 'function') {
      if (useLocalStorage) {
        const key = `app-oauth-state-${provider}`

        if (data.access_token || data.code) {
          setLocalStorageItem(key, data)
          window.opener && window.close()
        } else {
          setLocalStorageItem(key, {})

          this.localStoragePoll = setInterval(() => {
            const oauthState = getLocalStorageItem(key)
            if (oauthState.access_token) {
              clearInterval(this.localStoragePoll)
              return this.handleSuccess(oauthState)
            }
          }, 1000)
        }
      } else {
        const { addEventListener } = window
        const validSourceOrigin = redirectUri && new URL(redirectUri).origin

        addEventListener(
          'message',
          event => {
            const data = event.data
            const isValid =
              event.origin === validSourceOrigin ||
              data === 'strava connected' ||
              data === 'fitbit connected'

            if (isValid && !this.state.success) {
              return this.handleSuccess(data)
            }
          },
          false
        )
      }
    }

    if (data.access_token || data.code) {
      return this.handleSuccess(data)
    }
  }

  handleSuccess (data) {
    const { onSuccess, provider } = this.props

    const handleAuthSuccess = data => {
      return Promise.resolve()
        .then(() => this.setState({ status: 'fetching' }))
        .then(() => toPromise(onSuccess)(data))
        .then(() => this.setState({ status: 'fetched' }))
        .catch(() => this.setState({ status: 'empty', success: false }))
    }

    if (['justgiving', 'facebook'].indexOf(provider) > -1) {
      Promise.resolve()
        .then(() => this.setState({ success: true }))
        .then(() => connectToken(data))
        .then(handleAuthSuccess)
        .catch(error => {
          this.setState({ status: 'empty' })
          return Promise.reject(error)
        })
    } else {
      this.setState({ success: true })
      return handleAuthSuccess(data)
    }
  }

  handleAuth () {
    const { popupWindowFeatures, provider, onClose } = this.props

    const popupWindow = window.open(
      this.providerUrl(),
      `${provider}Auth`,
      popupWindowFeatures
    )

    this.setState({ status: 'loading' })

    this.isPopupClosed = setInterval(() => {
      popupWindow.postMessage('ready', '*')

      if (popupWindow.closed) {
        const { success } = this.state
        clearInterval(this.isPopupClosed)
        this.setState({ status: success ? 'loading' : 'empty' })

        if (typeof onClose === 'function') {
          return onClose(popupWindow)
        }
      }
    }, 500)
  }

  providerUrl () {
    const {
      clientId,
      homeUrl,
      provider,
      redirectUri,
      state,
      token,
      authParams = {}
    } = this.props

    if (['justgiving', 'facebook'].indexOf(provider) > -1) {
      const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        state: homeUrl && encodeURIComponent(`home=${homeUrl}`),
        acr_values:
          provider === 'facebook'
            ? `encodedOptions:${base64EncodeParams({ forceFacebook: true })}`
            : undefined,
        ...authParams
      }

      const urlParams = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')

      const baseURL = getBaseURL().replace('api', 'identity')

      return `${baseURL}/connect/authorize?${urlParams}&scope=openid+profile+email+account+fundraise+offline_access`
    } else if (provider === 'strava') {
      const baseURL = 'https://www.strava.com/oauth/authorize'

      const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'read,activity:read',
        state: state || token,
        ...authParams
      }

      const urlParams = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')

      return `${baseURL}?${urlParams}`
    } else if (provider === 'fitbit') {
      const baseURL = 'https://www.fitbit.com/oauth2/authorize'

      const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope:
          'activity heartrate location nutrition profile settings sleep social weight',
        state,
        ...authParams
      }

      const urlParams = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')

      return `${baseURL}?${urlParams}`
    } else {
      throw new Error(`JustGiving does not support ${provider} authentication`)
    }
  }

  render () {
    const { label, popup, provider, ...props } = this.props
    const { status } = this.state
    const isLoading = ['loading', 'fetching'].indexOf(status) > -1
    const icon = isLoading
      ? 'loading'
      : status === 'fetched'
        ? 'check'
        : provider

    const actionProps = popup
      ? {
          onClick: e => this.handleAuth()
        }
      : {
          href: this.providerUrl(),
          tag: 'a'
        }

    return (
      <Button
        aria-label={label}
        background={provider}
        disabled={isLoading}
        {...actionProps}
        {...omit(props, [
          'authParams',
          'clientId',
          'homeUrl',
          'onClose',
          'onSuccess',
          'popupWindowFeatures',
          'redirectUri',
          'token',
          'useLocalStorage'
        ])}
      >
        <Icon name={icon} spin={isLoading} size={1.5} />
        <span>
          {isLoading
            ? status === 'fetching'
                ? 'Fetching data...'
                : 'Connecting...'
            : label}
        </span>
      </Button>
    )
  }
}

ProviderOauthButton.propTypes = {
  /**
   * The OAuthApplication client ID
   */
  clientId: PropTypes.string.isRequired,

  /**
   * Button label
   */
  label: PropTypes.any,

  /**
   * The onClose event handler if popup is closed
   */
  onClose: PropTypes.func,

  /**
   * The onSuccess event handler if using a popup
   */
  onSuccess: PropTypes.func,

  /**
   * Whether to handle with a popup
   */
  popup: PropTypes.bool,

  /**
   * The features for the popup window (see https://developer.mozilla.org/en-US/docs/Web/API/Window/open#Window_features)
   */
  popupWindowFeatures: PropTypes.string,

  /**
   * The third-party provider to connect with
   */
  provider: PropTypes.oneOf(['strava', 'facebook', 'fitbit', 'justgiving']),

  /**
   * A valid return_to url for the specified OAuthApplication
   */
  redirectUri: PropTypes.string.isRequired,

  /**
   * The token of the existing user (used when connecting JG account to Strava)
   */
  token: PropTypes.string,

  /**
   * The slug of the existing user's page (used when connecting JG account to Fitbit)
   */
  slug: PropTypes.string,

  /**
   * The state includes semi-colon seperated string containing token, page slug, and measurement metric (required when connecting JG account to Fitbit)
   */
  state: PropTypes.string,

  /**
   * Home URl that our oauth handler (oauth.blackbaud-sites.com) will redirect to
   */
  homeUrl: PropTypes.string,

  /**
   * URL Params to be passed to provider
   */
  authParams: PropTypes.object
}

ProviderOauthButton.defaultProps = {
  label: 'Login with JustGiving',
  popup: true,
  popupWindowFeatures: 'width=600,height=900,status=1',
  provider: 'justgiving'
}

export default ProviderOauthButton
