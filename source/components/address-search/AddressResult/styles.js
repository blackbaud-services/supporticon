export default (props, traits) => {
  const { colors, rhythm } = traits

  const { isActive, styles } = props

  return {
    root: {
      padding: `${rhythm(0.5)} ${rhythm(1)}`,
      borderBottom: `1px solid ${colors.shade}`,
      backgroundColor: isActive && colors.primary,
      color: isActive && colors.light,
      cursor: 'pointer',
      ...styles
    }
  }
}
