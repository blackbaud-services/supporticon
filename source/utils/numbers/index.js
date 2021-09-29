const setLocaleFromCurrency = currencyCode => {
  const code = currencyCode.toLowerCase()
  switch (code) {
    case 'aud':
      return 'en-AU'
    case 'ca':
      return 'en-CA'
    case 'hk':
      return 'en-HK'
    case 'ie':
    case 'eur':
      return 'en-IE'
    case 'nzd':
      return 'en-NZ'
    case 'sgd':
      return 'en-SG'
    case 'usd':
      return 'en-US'
    case 'zar':
      return 'en-ZA'
    default:
      return 'en-GB'
  }
}

export const setLocaleFromCountry = country => `en-${country.toUpperCase()}`

export const setCurrencyFromCountry = location => {
  const country = location.toLowerCase().replace(/(en|cy|fr|ga)-/, '')

  switch (country) {
    case 'au':
      return 'aud'
    case 'ca':
      return 'cad'
    case 'hk':
      return 'hkd'
    case 'ie':
      return 'eur'
    case 'nz':
      return 'nzd'
    case 'sg':
      return 'sgd'
    case 'us':
      return 'usd'
    case 'za':
      return 'zar'
    default:
      return 'gbp'
  }
}

export const formatNumber = ({ amount, places = 0, locale, notation }) => {
  const country = locale || 'en-GB'
  return new Intl.NumberFormat(country, {
    maximumFractionDigits: amount > 999999 ? Math.max(1, places) : places,
    notation: !notation ? (amount > 999999 ? 'compact' : 'standard') : notation
  }).format(amount)
}

export const formatCurrency = ({
  amount,
  currencyCode,
  locale,
  notation
}) => {
  const country = locale || 'en-GB'
  const isLargeNumber = amount > 999999
  const isWholeNumber = amount % 1 === 0

  return new Intl.NumberFormat(country, {
    style: 'currency',
    currency: currencyCode ? currencyCode.toUpperCase() : setCurrencyFromCountry(country),
    minimumFractionDigits: isWholeNumber || isLargeNumber ? 0 : 2,
    maximumFractionDigits: isLargeNumber ? 1 : 2,
    notation: !notation ? (isLargeNumber ? 'compact' : 'standard') : notation
  }).format(amount)
}
