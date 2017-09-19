export default (props) => {
  const {
    disabled
  } = props

  return {
    pagination: {
      opacity: disabled ? '0.2 !important' : 1,
      pointerEvents: disabled ? 'none' : 'all'
    }
  }
}
