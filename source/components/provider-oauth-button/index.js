import React, { Component } from 'react'
import PropTypes from 'prop-types'
import URL from 'url-parse'
import omit from 'lodash/omit'
import snakeCase from 'lodash/snakeCase'
import { getBaseURL, isJustGiving } from '../../utils/client'
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
    this.providerUrl = this.providerUrl.bind(this)

    this.state = {
      status: 'empty'
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
        const hash = this.parseOauthHash(window.location.hash)

        if (hash.access_token) {
          setLocalStorageItem(key, hash)
          window.opener && window.close()
        } else {
          setLocalStorageItem(key, {})

          this.localStoragePoll = setInterval(() => {
            const oauthState = getLocalStorageItem(key)
            if (oauthState.access_token) {
              clearInterval(this.localStoragePoll)
              this.setState({ status: 'fetched' })
              return onSuccess(oauthState)
            }
          }, 1000)
        }
      } else {
        const { addEventListener } = window
        const validSourceOrigin = redirectUri && new URL(redirectUri).origin

        addEventListener(
          'message',
          event => {
            if (event.origin !== validSourceOrigin) {
              return
            }
            setTimeout(() => this.setState({ status: 'fetched' }), 500)
            return onSuccess(event.data)
          },
          false
        )
      }
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
        clearInterval(this.isPopupClosed)
        this.setState({ status: 'empty' })

        if (typeof onClose === 'function') {
          return onClose(popupWindow)
        }
      }
    }, 500)
  }

  providerUrl () {
    const { clientId, provider, redirectUri } = this.props

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

  parseOauthHash (hash) {
    return hash
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

    if (isJustGiving()) {
      return null
    }

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
          'onClose',
          'onSuccess',
          'popupWindowFeatures',
          'redirectUri',
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
  provider: PropTypes.oneOf(['facebook', 'mapmyfitness', 'strava', 'fitbit']),

  /**
   * A valid return_to url for the specified EDH OAuthApplication
   */
  redirectUri: PropTypes.string.isRequired
}

ProviderOauthButton.defaultProps = {
  label: 'Login with Facebook',
  popup: true,
  popupWindowFeatures: 'width=800,height=600,status=1',
  provider: 'facebook'
}

export default ProviderOauthButton
