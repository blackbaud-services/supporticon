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
      loading: false
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
        this.setState({ loading: false })
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

    const newWindow = window.open(this.providerUrl(), `${provider}-auth`, popupWindowFeatures)

    this.setState({ loading: true })

    const isPopupClosed = setInterval(() => {
      if (newWindow.closed) {
        clearInterval(isPopupClosed)
        this.setState({ loading: false })

        if (typeof onClose === 'function') {
          return onClose(newWindow)
        }
      }
    }, 1000)
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

    const { loading } = this.state

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
        disabled={loading}
        {...actionProps}
        {...omit(props, ['clientId', 'onClose', 'onSuccess', 'popupWindowFeatures', 'redirectUri'])}>
        <Icon name={loading ? 'loading' : provider} spin={loading} size={1.5} />
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
