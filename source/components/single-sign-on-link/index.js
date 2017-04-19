import React from 'react'
import Button from 'constructicon/button'
import getBaseURL from '../../utils/base-url'

const SingleSignOnLink = ({
  token,
  pageURL,
  label = 'My Fundraising Page',
  supporterCreateSessionURL = `${getBaseURL()}/api/v2/authentication/sessions`,
  ...props
}) => (
  token ? (
    <form method='POST' action={supporterCreateSessionURL}>
      <input type='hidden' name='access_token' value={token} />
      <input type='hidden' name='return_to' value={pageURL} />
      <Button {...props} type='submit'>{label}</Button>
    </form>
  ) : (
    <Button tag='a' href={pageURL} {...props}>
      {label}
    </Button>
  )
)

export default SingleSignOnLink
