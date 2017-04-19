import React from 'react'
import SingleSignOnLink from '..'

describe ('Components | SingleSignOnLink', () => {
  it ('renders a link when token is unprovided', () => {
    const wrapper = mount(<SingleSignOnLink label='Fundraise now!' pageURL='http://locahost:3000'/>)
    const a = wrapper.find('a')
    expect(a.length).to.eql(1)
    expect(a.prop('href')).to.eql('http://locahost:3000')
  })

  it ('renders a form when token is provided', () => {
    const wrapper = mount(<SingleSignOnLink label='Fundraise now!' pageURL='http://locahost:3000' token='123'/>)
    const a = wrapper.find('a')
    expect(a.length).to.eql(0)
    const form = wrapper.find('form')
    expect(form.length).to.eql(1)
    expect(form.prop('action')).to.eql('https://everydayhero.com/api/v2/authentication/sessions')
  })
})
