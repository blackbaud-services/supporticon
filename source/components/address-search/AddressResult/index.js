import React from 'react'
import withStyles from 'constructicon/with-styles'
import styles from './styles'

const AddressResult = ({
  classNames,
  isActive,
  result
}) => (
  <div className={classNames.root}>
    {result.label}
  </div>
)

export default withStyles(styles)(AddressResult)
