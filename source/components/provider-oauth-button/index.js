import React, { Component } from 'react'
import PropTypes from 'prop-types'
import URL from 'url-parse'
import omit from 'lodash/omit'
import snakeCase from 'lodash/snakeCase'
import { getBaseURL, isJustGiving, servicesAPI } from '../../utils/client'
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

    if (popup && typeof onSuccess === 'function') {
      if (useLocalStorage) {
        const key = `app-oauth-state-${provider}`
        const data = this.parseOauthData(
          window.location.search || window.location.hash
        )

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
              event.origin === validSourceOrigin || data === 'strava connected'

            if (isValid) {
              return this.handleSuccess(data)
            }
          },
          false
        )
      }
    }

    if (provider === 'justgiving') {
      const data = this.parseOauthData(
        window.location.search || window.location.hash
      )

      if (data.access_token || data.code) {
        return this.handleSuccess(data)
      }
    }
  }

  handleSuccess (data) {
    const { onSuccess, provider } = this.props

    if (provider === 'justgiving') {
      Promise.resolve()
        .then(() => this.setState({ success: true }))
        .then(() => servicesAPI.post('/v1/justgiving/oauth/connect', data))
        .then(response => response.data)
        .then(data => ({
          token: data.access_token,
          refreshToken: data.refresh_token
        }))
        .then(data => {
          this.setState({ status: 'fetched' })
          onSuccess(data)
        })
        .catch(error => {
          this.setState({ status: 'empty' })
          return Promise.reject(error)
        })
    } else {
      this.setState({ success: true })
      setTimeout(() => this.setState({ status: 'fetched' }), 500)
      onSuccess(data)
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
    const { clientId, homeUrl, provider, redirectUri, token } = this.props

    if (isJustGiving() && provider === 'strava') {
      const baseURL = 'https://www.strava.com/oauth/authorize'

      const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        scope: 'read,activity:read',
        state: token
      }

      const urlParams = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')

      return `${baseURL}?${urlParams}`
    } else if (isJustGiving()) {
      if (provider !== 'justgiving') {
        throw new Error(
          `JustGiving does not support ${provider} authentication`
        )
      }

      const params = {
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: 'code',
        state: homeUrl && encodeURIComponent(`home=${homeUrl}`)
      }

      const urlParams = Object.keys(params)
        .map(key => `${key}=${encodeURIComponent(params[key])}`)
        .join('&')

      const baseURL = getBaseURL().replace('api', 'identity')

      return `${baseURL}/connect/authorize?${urlParams}&scope=openid+profile+email+account+fundraise+offline_access`
    } else {
      const params = {
        clientId,
        forceProvider: provider,
        redirectUri,
        responseType: 'token'
      }

      const urlParams = Object.keys(params)
        .map(key => `${snakeCase(key)}=${encodeURIComponent(params[key])}`)
        .join('&')

      return `${getBaseURL()}/oauth/authorize?${urlParams}`
    }
  }

  parseOauthData (data) {
    return data
      .substring(1)
      .split('&')
      .reduce(function (params, part) {
        var item = part.split('=')
        params[decodeURIComponent(item[0])] = decodeURIComponent(item[1])
        return params
      }, {})
  }

  render () {
    const { label, popup, provider, ...props } = this.props

    const { status } = this.state
    const isLoading = status === 'loading'
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
        <span>{label}</span>
      </Button>
    )
  }
}

ProviderOauthButton.propTypes = {
  /**
   * The EDH OAuthApplication client ID
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
  provider: PropTypes.oneOf([
    'facebook',
    'mapmyfitness',
    'strava',
    'fitbit',
    'justgiving'
  ]),

  /**
   * A valid return_to url for the specified OAuthApplication
   */
  redirectUri: PropTypes.string.isRequired,

  /**
   * The token of the existing user (used when connecting JG account to Strava)
   */
  token: PropTypes.string,

  /**
   * Home URl that our oauth handler (oauth.blackbaud-sites.com) will redirect to
   */
  homeUrl: PropTypes.string
}

ProviderOauthButton.defaultProps = {
  label: 'Login with Facebook',
  popup: true,
  popupWindowFeatures: 'width=800,height=600,status=1',
  provider: 'facebook'
}

export default ProviderOauthButton
