import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { getBaseURL, isJustGiving } from '../../utils/client'
import { fetchCurrentUser } from '../../api/me'
import { submitCrossDomainForm } from '../../utils/cross-domain'

import Button from 'constructicon/button'
import Loading from 'constructicon/loading'

class SingleSignOnLink extends Component {
  constructor (props) {
    super(props)
    this.submitForm = this.submitForm.bind(this)

    this.state = {
      loading: false,
      target: props.target
    }
  }

  componentDidMount () {
    const { navigator } = window
    const ua = navigator.userAgent || navigator.vendor || window.opera

    // Detect FB mobile browser
    if ((ua.indexOf('FBAN') > -1) || (ua.indexOf('FBAV') > -1)) {
      this.setState({ target: '_self' })
    }
  }

  render () {
    const {
      label,
      method,
      token,
      url,
      ...props
    } = this.props

    const { loading, target } = this.state

    return (
      <div ref='root'>
        {(token && !isJustGiving()) ? (
          <form
            action={`${getBaseURL()}/api/v2/authentication/sessions`}
            method={method}
            target={target}
            onSubmit={(e) => this.setState({ loading: true })}>
            <input type='hidden' name='access_token' value={token} />
            <input type='hidden' name='return_to' value={url} />
            <Button {...props} type='submit'>
              <span>{label}</span>
              {loading && <Loading />}
            </Button>
          </form>
        ) : (
          <Button
            tag='a'
            href={url}
            target={target}
            onClick={(token && isJustGiving()) && this.submitForm}
            {...props}>
            <span>{label}</span>
            {loading && <Loading />}
          </Button>
        )}
      </div>
    )
  }

  submitForm (event) {
    const {
      token,
      url,
      method
    } = this.props

    const { root } = this.refs
    const { target } = this.state
    const decoded = window.atob(token).split(':')

    event.preventDefault()
    this.setState({ loading: true })

    window.addEventListener('message', ({ data }) => {
      if (data === 'cross-domain-cookie-auth') {
        return fetchCurrentUser({ token }).then(() => {
          const formSubmission = setInterval(() => {
            try {
              return root.querySelector('iframe').contentWindow.location.origin
            } catch (e) {
              clearInterval(formSubmission)
              return target === '_blank'
                ? window.open(url, '_blank')
                : window.location.assign(url)
            }
          }, 100)
        })
        .catch((error) => {
          return Promise.reject(error)
        })
      }
    })

    return submitCrossDomainForm({
      parent: root,
      method,
      message: 'cross-domain-cookie-auth',
      action: `${getBaseURL().replace('api', 'www')}/signin/login`,
      inputs: [{ name: 'Email', value: decoded[0] }, { name: 'Password', value: decoded[1] }, { name: 'LoginForever', value: true }]
    })
  }
}

SingleSignOnLink.propTypes = {
  /**
  * The token for an authenticated user
  */
  token: PropTypes.string,

  /**
  * The URL of a page
  */
  url: PropTypes.string.isRequired,

  /**
  * Button label
  */
  label: PropTypes.any,

  /**
  * The target for the form or anchor
  */
  target: PropTypes.oneOf([
    '_self',
    '_blank',
    '_parent',
    '_top'
  ]),

  /**
  * The method for the form action
  */
  method: PropTypes.string
}

SingleSignOnLink.defaultProps = {
  label: 'My Fundraising Page',
  target: '_self',
  method: 'POST'
}

export default SingleSignOnLink
