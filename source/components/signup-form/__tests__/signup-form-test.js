import React from 'react'
import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import SignupForm from '..'

describe ('Components | SignupForm', () => {
  describe ('EDH SignupForm', () => {
    it ('renders a simple sign up form', () => {
      const wrapper = mount(<SignupForm country='au' clientId='1234abcd' onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const select = wrapper.find('select')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(5)
      expect(select.length).to.eql(0)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Sign Up')
    })

    it ('renders a country select when no country prop is supplied', () => {
      const wrapper = mount(<SignupForm clientId='1234abcd' onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const select = wrapper.find('select')

      expect(inputs.length).to.eql(5)
      expect(select.length).to.eql(1)
    })

    it ('allows a custom submit button label to be passed', () => {
      const wrapper = mount(<SignupForm clientId='1234abcd' submit='Sign Up to EDH' onSuccess={(res) => console.log(res)} />)
      const button = wrapper.find('button')

      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Sign Up to EDH')
    })
  })

  describe ('JG SignupForm', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com', headers: { 'x-api-key': 'abcd1234' } })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('renders a simple sign up form with custom submit prop', () => {
      const wrapper = mount(<SignupForm onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const select = wrapper.find('select')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(9)
      expect(select.length).to.eql(1)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Sign Up')
    })

    it ('allows a custom submit button label to be passed', () => {
      const wrapper = mount(<SignupForm submit='Sign Up to JustGiving' onSuccess={(res) => console.log(res)} />)
      const button = wrapper.find('button')

      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Sign Up to JustGiving')
    })
  })
})
