import {
  updateClient,
  instance
} from '..'

describe ('Utils | instance', () => {
  it ('exports an axios instance with a default baseURL', () => {
    expect(typeof instance.get).to.eql('function')
    expect(typeof instance.post).to.eql('function')
    expect(instance.defaults.baseURL).to.eql('https://everydayhero.com')
  })

  it ('allows you to update the baseURL of the instance', () => {
    updateClient({ baseURL: 'https://everydayhero-staging.com' })
    expect(instance.defaults.baseURL).to.eql('https://everydayhero-staging.com')
    updateClient({ baseURL: 'https://everydayhero.com' })
  })
})
