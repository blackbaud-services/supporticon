import React from 'react'
import SingleSignOnLink from '..'

import { instance } from '../../../utils/client'

describe('Components | SingleSignOnLink', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('renders a link when token is not provided', () => {
    const wrapper = mount(
      <SingleSignOnLink label='Fundraise now!' url='http://locahost:3000' />
    )
    const a = wrapper.find('a')
    expect(a.length).to.eql(1)
    expect(a.prop('href')).to.eql('http://locahost:3000')
  })

  it('renders a link with an onClick handler when token is provided', () => {
    const wrapper = mount(
      <SingleSignOnLink
        label='Fundraise now!'
        url='http://locahost:3000'
        token='abc123'
      />
    )
    const a = wrapper.find('a')
    const button = wrapper.find('Button')
    expect(a.length).to.eql(1)
    expect(a.prop('href')).to.eql('http://locahost:3000')
    expect(button.length).to.eql(1)
    expect(button.prop('onClick')).to.be.a('function')
  })

  it('does not render a link with an onClick handler when token is not provided', () => {
    const wrapper = mount(
      <SingleSignOnLink label='Fundraise now!' url='http://locahost:3000' />
    )
    const a = wrapper.find('a')
    const button = wrapper.find('Button')
    expect(button.length).to.eql(1)
    expect(button.prop('onClick')).to.not.be.a('function')
  })

  it('does not render a form', () => {
    const wrapper = mount(
      <SingleSignOnLink label='Fundraise now!' url='http://locahost:3000' />
    )
    const form = wrapper.find('form')
    expect(form.length).to.eql(0)
  })
})
