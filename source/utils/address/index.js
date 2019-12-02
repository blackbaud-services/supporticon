export const localityLabel = country => {
  switch (country) {
    case 'au':
    case 'nz':
      return 'Town/Suburb'
    case 'ie':
      return 'Town/City'
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
    case 'ie':
      return 'County'
    case 'ca':
      return 'Province'
    default:
      return 'State'
  }
}

export const postCodeLabel = country => {
  switch (country) {
    case 'us':
      return 'Zip Code'
    default:
      return 'Postcode'
  }
}
