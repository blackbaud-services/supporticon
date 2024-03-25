import { updateClient, instance } from '..'

describe('Utils | instance', () => {
  it('exports an axios instance with a default baseURL', () => {
    expect(typeof instance.get).to.eql('function')
    expect(typeof instance.post).to.eql('function')
    expect(instance.defaults.baseURL).to.eql('https://api.justgiving.com')
  })

  it('allows you to update the baseURL of the instance', () => {
    updateClient({ baseURL: 'https://api.staging.justgiving.com' })
    expect(instance.defaults.baseURL).to.eql(
      'https://api.staging.justgiving.com'
    )
    updateClient({ baseURL: 'https://api.justgiving.com' })
  })
})
