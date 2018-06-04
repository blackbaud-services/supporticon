export default (props, traits) => {
  const {
    treatments
  } = traits

  return {
    cancel: {
      cursor: 'pointer',
      textDecoration: 'underline',
      ...treatments.body
    }
  }
}
