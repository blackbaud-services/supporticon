export default (props, traits) => {
  const {
    disabled
  } = props

  const {
    rhythm
  } = traits

  return {
    root: {
      width: rhythm(2),
      textAlign: 'center'
    },

    pagination: {
      opacity: disabled ? '0.2 !important' : 1,
      pointerEvents: disabled ? 'none' : 'all'
    }
  }
}
