import React from 'react'
import PropTypes from 'prop-types'
import Button from 'constructicon/button'
import { getBaseURL } from '../../utils/client'

const SingleSignOnLink = ({
  token,
  pageURL,
  label,
  supporterCreateSessionURL,
  target,
  ...props
}) => (
  token ? (
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
)

SingleSignOnLink.propTypes = {
  /**
  * The OAuth token for an authenticated user
  */
  token: PropTypes.string,

  /**
  * The URL of a page
  */
  pageURL: PropTypes.string.required,

  /**
  * Button label
  */
  label: PropTypes.string,

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
  supporterCreateSessionURL: `${getBaseURL()}/api/v2/authentication/sessions`,
  target: '_self'
}

export default SingleSignOnLink
