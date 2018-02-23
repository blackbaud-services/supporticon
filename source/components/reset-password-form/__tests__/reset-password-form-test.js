import React from 'react'
import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import ResetPasswordForm from '..'

describe ('Components | ResetPasswordForm', () => {
  describe ('EDH ResetPasswordForm', () => {
    it ('renders a simple login form', () => {
      const wrapper = mount(<ResetPasswordForm clientId='1234abcd' onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(1)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Send reset password instructions')
    })
  })

  describe ('JG ResetPasswordForm', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com', headers: { 'x-api-key': 'abcd1234' } })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('renders a simple login form with custom submit prop', () => {
      const wrapper = mount(<ResetPasswordForm submit='Send reset password email' onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(1)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Send reset password email')
    })
  })
})
