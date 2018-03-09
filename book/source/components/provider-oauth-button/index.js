import React, { Component } from 'react'
import PropTypes from 'prop-types'
import omit from 'lodash/omit'
import snakeCase from 'lodash/snakeCase'
import { getBaseURL, isJustGiving } from '../../utils/client'

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

  isValidUri (url) {
    try {
      return new window.URL(url)
    } catch (error) {
      return false
    }
  }

  componentDidMount () {
    const { onSuccess, redirectUri } = this.props

    if (this.isValidUri(redirectUri) && typeof onSuccess === 'function') {
      const { addEventListener, URL } = window
      const validSourceOrigin = new URL(redirectUri).origin

      addEventListener('message', (event) => {
        if (event.origin !== validSourceOrigin) { return }
        setTimeout(() => this.setState({ status: 'fetched' }), 500)
        return onSuccess(event.data)
      }, false)
    }
  }

  handleAuth () {
    const {
      popupWindowFeatures,
      provider,
      onClose
    } = this.props

    const popupWindow = window.open(this.providerUrl(), `${provider}Auth`, popupWindowFeatures)

    this.setState({ status: 'loading' })

    const isPopupClosed = setInterval(() => {
      if (popupWindow.closed) {
        clearInterval(isPopupClosed)
        this.setState({ status: 'empty' })

        if (typeof onClose === 'function') {
          return onClose(popupWindow)
        }
      }
    }, 500)
  }

  providerUrl () {
    const {
      clientId,
      provider,
      redirectUri
    } = this.props

    const params = {
      clientId,
      forceProvider: provider,
      redirectUri,
      responseType: 'token'
    }

    const urlParams = Object.keys(params).map((key) => (
      `${snakeCase(key)}=${encodeURIComponent(params[key])}`
    )).join('&')

    return `${getBaseURL()}/oauth/authorize?${urlParams}`
  }

  render () {
    const {
      label,
      popup,
      provider,
      ...props
    } = this.props

    const { status } = this.state
    const isLoading = status === 'loading'
    const icon = isLoading ? 'loading' : status === 'fetched' ? 'check' : provider

    if (isJustGiving()) { return null }

    const actionProps = popup ? {
      onClick: (e) => this.handleAuth()
    } : {
      href: this.providerUrl(),
      tag: 'a'
    }

    return (
      <Button
        aria-label={label}
        background={provider}
        disabled={isLoading}
        {...actionProps}
        {...omit(props, ['clientId', 'onClose', 'onSuccess', 'popupWindowFeatures', 'redirectUri'])}>
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
  provider: PropTypes.oneOf(['facebook', 'mapmyfitness', 'strava']),

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
