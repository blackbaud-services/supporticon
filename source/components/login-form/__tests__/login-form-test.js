import React from 'react'
import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import LoginForm from '..'

describe ('Components | LoginForm', () => {
  describe ('EDH LoginForm', () => {
    it ('renders a simple login form', () => {
      const wrapper = mount(<LoginForm clientId='1234abcd' onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(2)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Log in')
    })
  })

  describe ('JG LoginForm', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com', headers: { 'x-api-key': 'abcd1234' } })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('renders a simple login form with custom submit prop', () => {
      const wrapper = mount(<LoginForm submit='Sign in to JustGiving' onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(2)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Sign in to JustGiving')
    })
  })
})
