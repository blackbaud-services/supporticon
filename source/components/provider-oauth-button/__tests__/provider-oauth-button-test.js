import React from 'react'
import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import ProviderOauthButton from '..'

describe('Components | ProviderOauthButton', () => {
  describe('JG ProviderOauthButton', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(instance)
    })

    it('does not render a button', () => {
      const wrapper = mount(
        <ProviderOauthButton
          clientId='1234'
          redirectUri='https://justgiving.com'
        />
      )
      const a = wrapper.find('a')
      expect(a.length).to.eql(0)
    })

    it('sets a different provider when passed', () => {
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
      expect(link.prop('href')).to.include('google.com')
      expect(link.text()).to.eql('Connect with Strava')
    })

    it('renders a link with no popup', () => {
      const wrapper = mount(
        <ProviderOauthButton
          clientId='1234'
          redirectUri='https://google.com'
          provider='strava'
          popup={false}
        />
      )

      const link = wrapper.find('a')
      expect(link.length).to.eql(1)
      expect(link.prop('href')).to.include(
        'https://www.strava.com/oauth/authorize'
      )
      expect(link.prop('href')).to.include('google.com')
    })
  })
})
