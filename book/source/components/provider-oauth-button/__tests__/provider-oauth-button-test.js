import React from 'react'
import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import ProviderOauthButton from '..'

describe ('Components | ProviderOauthButton', () => {
  describe ('EDH ProviderOauthButton', () => {
    it ('renders a default button', () => {
      const wrapper = mount(
        <ProviderOauthButton
          clientId='1234'
          redirectUri='https://everydayhero.com'
        />
      )

      const button = wrapper.find('button')
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Login with Facebook')
    })

    it ('renders a link with no popup', () => {
      const wrapper = mount(
        <ProviderOauthButton
          clientId='1234'
          redirectUri='https://google.com'
          popup={false}
        />
      )

      const link = wrapper.find('a')
      expect(link.length).to.eql(1)
      expect(link.prop('href')).to.include('https://everydayhero.com/oauth/authorize')
      expect(link.prop('href')).to.include('google.com')
    })

    it ('sets a different provider when passed', () => {
      const wrapper = mount(
        <ProviderOauthButton
          clientId='1234'
          redirectUri='https://google.com'
          provider='strava'
          label='Connect with Strava'
          popup={false}
        />
      )

      const link = wrapper.find('a')
      expect(link.length).to.eql(1)
      expect(link.prop('href')).to.include('force_provider=strava')
      expect(link.prop('href')).to.include('google.com')
      expect(link.text()).to.eql('Connect with Strava')
    })
  })

  describe ('JG ProviderOauthButton', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com', headers: { 'x-api-key': 'abcd1234' } })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('does not render a button', () => {
      const wrapper = mount(<ProviderOauthButton clientId='1234' redirectUri='https://justgiving.com' />)
      const a = wrapper.find('a')
      expect(a.length).to.eql(0)
    })
  })
})
