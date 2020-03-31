import React from 'react'
import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import CreateFitnessForm from '..'

describe('Components | CreateFitnessForm', () => {
  describe('EDH CreateFitnessForm', () => {
    beforeEach(() => {
      moxios.install(instance)
    })

    afterEach(() => {
      moxios.uninstall(instance)
    })

    it('renders a simple create fitness form', done => {
      const wrapper = mount(
        <CreateFitnessForm
          pageId='12345'
          token='xxxx'
          onSuccess={res => console.log(res)}
        />
      )

      const inputs = wrapper.find('input')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(4)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Log fitness activity')
      done()
    })

    it('allows a custom submit button label to be passed', done => {
      const wrapper = mount(
        <CreateFitnessForm
          pageId='12345'
          token='xxxx'
          submit='Create fitness activity on EDH'
          onSuccess={res => console.log(res)}
        />
      )

      const button = wrapper.find('button')

      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Create fitness activity on EDH')
      done()
    })
  })

  describe('JG CreateFitnessForm', () => {
    beforeEach(() => {
      updateClient({
        baseURL: 'https://api.justgiving.com',
        headers: { 'x-api-key': 'abcd1234' }
      })
      moxios.install(instance)
    })

    afterEach(() => {
      updateClient({ baseURL: 'https://everydayhero.com' })
      moxios.uninstall(instance)
    })

    it('renders a simple create fitness form', () => {
      const wrapper = mount(
        <CreateFitnessForm
          token='xxxx'
          pageSlug='test-page'
          onSuccess={res => console.log(res)}
        />
      )
      const inputs = wrapper.find('input')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(4)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Log fitness activity')
    })

    it('allows a custom submit button label to be passed', () => {
      const wrapper = mount(
        <CreateFitnessForm
          token='xxxx'
          pageSlug='test-page'
          submit='Create fitness activity on JustGiving'
          onSuccess={res => console.log(res)}
        />
      )
      const button = wrapper.find('button')

      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Create fitness activity on JustGiving')
    })
  })
})
