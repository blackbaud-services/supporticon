import React from 'react'
import Icon from 'constructicon/icon'
import { withStyles } from 'constructicon/lib/css'
import styles from './styles'

const PaginationLink = ({
  disabled,
  onClick,
  rotate,
  classNames
}) => (
  <button onClick={onClick} disabled={disabled} className={classNames.pagination}>
    <Icon name='chevron' rotate={rotate} size={1} />
  </button>
)

export default withStyles(styles)(PaginationLink)
