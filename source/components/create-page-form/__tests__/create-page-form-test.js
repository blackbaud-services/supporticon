import React from 'react'
import moxios from 'moxios'
import { instance, updateClient } from '../../../utils/client'

import CreatePageForm from '..'

describe ('Components | CreatePageForm', () => {
  describe ('EDH CreatePageForm', () => {
    beforeEach (() => {
      moxios.install(instance)
    })

    afterEach (() => {
      moxios.uninstall(instance)
    })

    it ('renders a simple create page form', (done) => {
      const wrapper = mount(<CreatePageForm campaignId='au-123' token='1234abcd' onSuccess={(res) => console.log(res)} />)

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/campaigns')
        expect(request.url).to.contain('au-123')

        request.respondWith({
          status: 200,
          response: { campaign_groups: [] }
        })

        // Re-render
        setTimeout(() => {
          const inputs = wrapper.find('input')
          const button = wrapper.find('button')

          expect(inputs.length).to.eql(1)
          expect(button.length).to.eql(1)
          expect(button.text()).to.eql('Create Page')
          done()
        })
      })
    })

    it ('shows a loading spinner while fetching groups', () => {
      const wrapper = mount(<CreatePageForm campaignId='au-123' token='1234abcd' onSuccess={(res) => console.log(res)} />)

      const icon = wrapper.find('svg')
      expect(icon.length).to.eql(1)
    })

    it ('allows a custom submit button label to be passed', (done) => {
      const wrapper = mount(<CreatePageForm campaignId='au-123' token='1234abcd' submit='Create Page on EDH' onSuccess={(res) => console.log(res)} />)

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/campaigns')
        expect(request.url).to.contain('au-123')

        request.respondWith({
          status: 200,
          response: { campaign_groups: [] }
        })

        // Re-render
        setTimeout(() => {
          const button = wrapper.find('button')

          expect(button.length).to.eql(1)
          expect(button.text()).to.eql('Create Page on EDH')
          done()
        })
      })
    })

    it ('allows for custom fields to be passed', (done) => {
      const wrapper = mount(<CreatePageForm campaignId='au-123' token='1234abcd' fields={{ name: { type: 'text'} }} onSuccess={(res) => console.log(res)} />)

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/campaigns')
        expect(request.url).to.contain('au-123')

        request.respondWith({
          status: 200,
          response: { campaign_groups: [] }
        })

        // Re-render
        setTimeout(() => {
          const inputs = wrapper.find('input')

          expect(inputs.length).to.eql(2)
          done()
        })
      })
    })

    it ('adds required group fields when fetched', (done) => {
      const wrapper = mount(<CreatePageForm campaignId='au-456' token='1234abcd' onSuccess={(res) => console.log(res)} />)

      moxios.wait(() => {
        const request = moxios.requests.mostRecent()
        expect(request.url).to.contain('https://everydayhero.com/api/v2/campaigns')
        expect(request.url).to.contain('au-456')

        request.respondWith({
          status: 200,
          response: {
            campaign_groups: [
              {
                id: 1,
                key: 'location',
                label: 'Selection your location',
                values: ['Brisbane', 'Sydney', 'Melbourne', 'Adelaide', 'Hobart', 'Perth', 'Canberra', 'Darwin']
              },
              {
                id: 2,
                key: 'source',
                label: 'How did you hear about us?',
                values: ['Online', 'TV', 'Radio', 'Word of mouth', 'Other']
              }
            ]
          }
        }).then(() => {
          const input = wrapper.find('input')
          const selects = wrapper.find('select')

          expect(input.length).to.eql(1)
          expect(selects.length).to.eql(2)
          done()
        })
      })
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
      const wrapper = mount(<CreatePageForm eventId='12345' charityId='56789' onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      const button = wrapper.find('button')

      expect(inputs.length).to.eql(2)
      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Create Page')
    })

    it ('allows a custom submit button label to be passed', () => {
      const wrapper = mount(<CreatePageForm eventId='12345' charityId='56789' submit='Create Page on JustGiving' onSuccess={(res) => console.log(res)} />)
      const button = wrapper.find('button')

      expect(button.length).to.eql(1)
      expect(button.text()).to.eql('Create Page on JustGiving')
    })

    it ('allows for custom fields to be passed', () => {
      const wrapper = mount(<CreatePageForm eventId='12345' charityId='56789' fields={{ name: { type: 'text'} }} onSuccess={(res) => console.log(res)} />)
      const inputs = wrapper.find('input')
      expect(inputs.length).to.eql(3)
    })
  })
})
