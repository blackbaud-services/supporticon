import { formatCurrency, formatNumber } from '..'

describe('Utils | Format Number', () => {
  it('returns string', () => {
    const number = formatNumber({ amount: 999 })
    expect(number).to.be.a('string')
  })
  it('adds commas', () => {
    const number = formatNumber({ amount: 9999 })
    expect(number).to.eql('9,999')
  })
  it('floats the correct number of digits', () => {
    const number = formatNumber({ amount: 99.123456, places: 2 })
    expect(number).to.eql('99.12')
  })
})

describe('Utils | Format Currency', () => {
  it('returns string', () => {
    const number = formatCurrency({ amount: 999 })
    expect(number).to.be.a('string')
  })
  it('adds commas and currency symbol', () => {
    const number = formatCurrency({ amount: 9999 })
    expect(number).to.eql('£9,999')
  })
  it('adds correct number of places', () => {
    const number = formatCurrency({ amount: 1234.56, places: 2 })
    expect(number).to.eql('£1,234.56')
  })
  it('adds correct currency symbol', () => {
    const number = formatCurrency({ amount: 9999, currencyCode: 'AUD' })
    expect(number).to.eql('$9,999')
  })
  it('adds correct currency symbol based on locale', () => {
    const number = formatCurrency({ amount: 9999, locale: 'en-IE' })
    expect(number).to.eql('€9,999')
  })
  it('adds correct currency symbol based on different locale', () => {
    const number = formatCurrency({ amount: 9999, locale: 'en-US', currencyCode: 'NZD' })
    expect(number).to.eql('NZ$9,999')
  })
  it('it uses correct notation when set', () => {
    const number = formatCurrency({ amount: 9999999, notation: 'compact' })
    expect(number).to.eql('£10M')
  })
})
