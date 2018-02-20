import React from 'react'
import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import SingleSignOnLink from '..'

describe ('Components | SingleSignOnLink', () => {
  describe ('EDH SingleSignOnLink', () => {
    it ('renders a link when token is not provided', () => {
      const wrapper = mount(<SingleSignOnLink label='Fundraise now!' url='http://locahost:3000' />)
      const a = wrapper.find('a')
      const button = wrapper.find('Button')
      expect(a.length).to.eql(1)
      expect(a.prop('href')).to.eql('http://locahost:3000')
      expect(button.length).to.eql(1)
      expect(button.prop('onClick')).to.not.be.a('function')
    })

    it ('renders a form when token is provided', () => {
      const wrapper = mount(<SingleSignOnLink label='Fundraise now!' url='http://locahost:3000' token='123' />)
      const a = wrapper.find('a')
      expect(a.length).to.eql(0)
      const form = wrapper.find('form')
      expect(form.length).to.eql(1)
      expect(form.prop('action')).to.eql('https://everydayhero.com/api/v2/authentication/sessions')
    })
  })

  describe ('JG SingleSignOnLink', () => {
    beforeEach (() => {
      updateClient({ baseURL: 'https://api.justgiving.com', headers: { 'x-api-key': 'abcd1234' } })
      moxios.install(instance)
    })

    afterEach (() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it ('renders a link when token is not provided', () => {
      const wrapper = mount(<SingleSignOnLink label='Fundraise now!' url='http://locahost:3000'/>)
      const a = wrapper.find('a')
      expect(a.length).to.eql(1)
      expect(a.prop('href')).to.eql('http://locahost:3000')
    })

    it ('renders a link with an onClick handler when token is provided', () => {
      const wrapper = mount(<SingleSignOnLink label='Fundraise now!' url='http://locahost:3000' token='abc123' />)
      const a = wrapper.find('a')
      const button = wrapper.find('Button')
      expect(a.length).to.eql(1)
      expect(a.prop('href')).to.eql('http://locahost:3000')
      expect(button.length).to.eql(1)
      expect(button.prop('onClick')).to.be.a('function')
    })

    it ('does not render a link with an onClick handler when token is not provided', () => {
      const wrapper = mount(<SingleSignOnLink label='Fundraise now!' url='http://locahost:3000' />)
      const a = wrapper.find('a')
      const button = wrapper.find('Button')
      expect(button.length).to.eql(1)
      expect(button.prop('onClick')).to.not.be.a('function')
    })

    it ('does not render a form', () => {
      const wrapper = mount(<SingleSignOnLink label='Fundraise now!' url='http://locahost:3000' />)
      const form = wrapper.find('form')
      expect(form.length).to.eql(0)
    })
  })
})
