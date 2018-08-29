export default (props, { treatments }) => ({
  cancel: {
    cursor: 'pointer',
    textDecoration: 'underline',
    ...treatments.body
  }
})
