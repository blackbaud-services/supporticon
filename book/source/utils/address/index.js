export const localityLabel = country => {
  switch (country) {
    case 'au':
      return 'Town/Suburb'
    case 'uk':
    case 'gb':
      return 'Town'
    default:
      return 'City'
  }
}

export const regionLabel = country => {
  switch (country) {
    case 'uk':
    case 'gb':
      return 'County'
    default:
      return 'State'
  }
}

export const postCodeLabel = country => {
  switch (country) {
    case 'us':
    case 'ca':
      return 'Zip Code'
    default:
      return 'Postcode'
  }
}
