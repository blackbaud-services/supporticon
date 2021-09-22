import { formatCurrency, formatNumber } from '..'

describe('Utils | Format Number', () => {
  it('returns string', () => {
    const number = formatNumber({ amount: 999 })
    expect(number).to.be.a('string')
  })
  it('adds commas', () => {
    const number = formatNumber({ amount: 9999 })
    expect(number).to.be.have.lengthOf(5)
  })
  it('uses compact format on large numbers', () => {
    const number = formatNumber({ amount: 9999999 })
    expect(number).to.be.have.lengthOf(3)
  })
  it('floats the correct number of digits', () => {
    const number = formatNumber({ amount: 99.123456, places: 2 })
    expect(number).to.be.have.lengthOf(5)
  })
  it('floats the correct number of digits on large number using compact notation', () => {
    const largeNumber = formatNumber({ amount: 999999.123456, places: 4 })
    expect(largeNumber).to.be.have.lengthOf(9)
  })
})

describe('Utils | Format Currency', () => {
  it('returns string', () => {
    const number = formatCurrency({ amount: 999 })
    expect(number).to.be.a('string')
  })
  it('adds commas and currency symbol', () => {
    const number = formatCurrency({ amount: 9999 })
    expect(number).to.be.have.lengthOf(6)
  })
  it('uses compact format on large numbers', () => {
    const number = formatCurrency({ amount: 9999999 })
    expect(number).to.be.have.lengthOf(4)
  })
  it('it uses correct notation when set', () => {
    const number = formatCurrency({ amount: 9999999, notation: 'standard' })
    expect(number).to.be.have.lengthOf(10)
  })
})
