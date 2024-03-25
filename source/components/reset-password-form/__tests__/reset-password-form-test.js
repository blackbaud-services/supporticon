import React from 'react'
import ResetPasswordForm from '..'

import { instance } from '../../../utils/client'

describe('Components | ResetPasswordForm', () => {
  beforeEach(() => {
    moxios.install(instance)
  })

  afterEach(() => {
    moxios.uninstall(instance)
  })

  it('renders a simple login form with custom submit prop', () => {
    const wrapper = mount(
      <ResetPasswordForm
        submit='Send reset password email'
        onSuccess={res => console.log(res)}
      />
    )
    const inputs = wrapper.find('input')
    const button = wrapper.find('button')

    expect(inputs.length).to.eql(1)
    expect(button.length).to.eql(1)
    expect(button.text()).to.eql('Send reset password email')
  })
})
