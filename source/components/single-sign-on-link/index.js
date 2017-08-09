import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Button from 'constructicon/button'
import { getBaseURL } from '../../utils/client'

class SingleSignOnLink extends Component {
  constructor (props) {
    super(props)

    this.state = {
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
      token,
      pageURL,
      label,
      supporterCreateSessionURL = `${getBaseURL()}/api/v2/authentication/sessions`,
      ...props
    } = this.props

    const { target } = this.state

    return token ? (
      <form method='POST' action={supporterCreateSessionURL} target={target}>
        <input type='hidden' name='access_token' value={token} />
        <input type='hidden' name='return_to' value={pageURL} />
        <Button {...props} type='submit'>{label}</Button>
      </form>
    ) : (
      <Button tag='a' href={pageURL} target={target} {...props}>
        {label}
      </Button>
    )
  }
}

SingleSignOnLink.propTypes = {
  /**
  * The OAuth token for an authenticated user
  */
  token: PropTypes.string,

  /**
  * The URL of a page
  */
  pageURL: PropTypes.string.isRequired,

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
  ])
}

SingleSignOnLink.defaultProps = {
  label: 'My Fundraising Page',
  target: '_self'
}

export default SingleSignOnLink
