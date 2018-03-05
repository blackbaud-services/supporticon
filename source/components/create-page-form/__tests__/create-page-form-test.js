import React from 'react'
import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import CreatePageForm from '..'

describe ('Components | CreatePageForm', () => {
  describe ('EDH CreatePageForm', () => {
    it ('renders a simple create page form', () => {
      const wrapper = mount(<CreatePageForm country='au' clientId='1234abcd' onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(1)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Create Page')
    })

    it ('allows a custom submit button label to be passed', () => {
      const wrapper = mount(<CreatePageForm clientId='1234abcd' submit='Create Page on EDH' onSuccess={(res) => console.log(res)} />)
      const button = wrapper.find('button')

      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Create Page on EDH')
    })

    it ('allows for custom fields to be passed', () => {
      const wrapper = mount(<CreatePageForm clientId='1234abcd' fields={{ name: { type: 'text'} }} onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      expect(inputs.length).to.eql(2)
    })
  })

  describe ('JG CreatePageForm', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com', headers: { 'x-api-key': 'abcd1234' } })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('renders a simple create page form with custom submit prop', () => {
      const wrapper = mount(<CreatePageForm onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(2)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Create Page')
    })

    it ('allows a custom submit button label to be passed', () => {
      const wrapper = mount(<CreatePageForm submit='Create Page on JustGiving' onSuccess={(res) => console.log(res)} />)
      const button = wrapper.find('button')

      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Create Page on JustGiving')
    })

    it ('allows for custom fields to be passed', () => {
      const wrapper = mount(<CreatePageForm fields={{ name: { type: 'text'} }} onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      expect(inputs.length).to.eql(3)
    })
  })
})
