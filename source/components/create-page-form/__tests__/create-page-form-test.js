import React from 'react';

import { instance } from '../../../utils/client';
import CreatePageForm from '..';

describe('Components | CreatePageForm', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('renders a simple create page form with custom submit prop', () => {
    const wrapper = mount(
      <CreatePageForm
        eventId="12345"
        charityId="56789"
        token="12345678"
        onSuccess={(res) => console.log(res)}
      />
    );
    const inputs = wrapper.find('input');
    const button = wrapper.find('button');

    expect(inputs.length).to.eql(1);
    expect(button.length).to.eql(1);
    expect(button.text()).to.eql('Create Page');
  });

  it('allows a custom submit button label to be passed', () => {
    const wrapper = mount(
      <CreatePageForm
        eventId="12345"
        charityId="56789"
        submit="Create Page on JustGiving"
        token="12345678"
        onSuccess={(res) => console.log(res)}
      />
    );
    const button = wrapper.find('button');

    expect(button.length).to.eql(1);
    expect(button.text()).to.eql('Create Page on JustGiving');
  });

  it('allows for custom fields to be passed', () => {
    const wrapper = mount(
      <CreatePageForm
        eventId="12345"
        charityId="56789"
        token="12345678"
        fields={{ name: { type: 'text' } }}
        onSuccess={(res) => console.log(res)}
      />
    );
    const inputs = wrapper.find('input');
    expect(inputs.length).to.eql(2);
  });
});
