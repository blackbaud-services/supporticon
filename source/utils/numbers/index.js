import merge from 'lodash/merge'
import { currencyCode } from '../currencies'

export const setLocaleFromCurrency = currency => {
  if (typeof currency !== 'string') return 'en-GB'

  const code = currency.toLowerCase()

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

export const setLocaleFromCountry = country => {
  if (typeof country !== 'string') return 'en-GB'
  return `en-${country.toUpperCase()}`
}

export const formatNumber = ({
  amount,
  locale = 'en-GB',
  notation = 'standard',
  places = 0,
  style = 'decimal',
  ...options
}) => {
  const config = merge({}, {
    minimumFractionDigits: 0,
    maximumFractionDigits: Math.min(places, 20),
    notation,
    style
  }, options)

  return Intl.NumberFormat(locale, config).format(amount)
}

export const formatCurrency = ({
  amount,
  currencyCode: currency,
  currencyDisplay = 'symbol',
  locale: baseLocale,
  notation,
  places
}) => {
  const locale = baseLocale || setLocaleFromCurrency(currency)
  const isWholeNumber = amount % 1 === 0

  return formatNumber({
    amount,
    currency: currency ? currency.toUpperCase() : currencyCode(locale),
    currencyDisplay,
    locale,
    minimumFractionDigits: places && !isWholeNumber ? 2 : 0,
    maximumFractionDigits: places ? 2 : 0,
    notation,
    places,
    style: 'currency'
  })
}
