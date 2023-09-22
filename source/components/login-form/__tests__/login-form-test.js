import React from 'react';

import { instance } from '../../../utils/client';
import LoginForm from '..';

describe('Components | LoginForm', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('renders a simple login form with custom submit prop', () => {
    const wrapper = mount(
      <LoginForm submit="Sign in to JustGiving" onSuccess={(res) => console.log(res)} />
    );
    const inputs = wrapper.find('input');
    const button = wrapper.find('button[type="submit"]');

    expect(inputs.length).to.eql(2);
    expect(button.length).to.eql(1);
    expect(button.text()).to.eql('Sign in to JustGiving');
  });
});
