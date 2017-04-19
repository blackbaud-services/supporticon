import getBaseURL, { update } from '..'

describe ('Utils | BaseURL', () => {
  it ('exports a function with a default production URL', () => {
    expect(typeof getBaseURL).to.eql('function')
    expect(getBaseURL()).to.eql('https://everydayhero.com')
  })

  it ('allows to change the default URL', () => {
    update('https://everydayhero-staging.com')
    expect(getBaseURL()).to.eql('https://everydayhero-staging.com')
    update('https://everydayhero.com')
  })
})
