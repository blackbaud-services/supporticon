import React from 'react';

import { instance } from '../../../utils/client';
import SignupForm from '..';

describe('Components | SignupForm', () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it('renders a simple sign up form with custom submit prop', () => {
    const wrapper = mount(<SignupForm onSuccess={(res) => console.log(res)} />);
    const inputs = wrapper.find('input');
    const button = wrapper.find('button[type="submit"]');

    expect(inputs.length).to.eql(4);
    expect(button.length).to.eql(1);
    expect(button.text()).to.eql('Sign Up');
  });

  it('allows a custom submit button label to be passed', () => {
    const wrapper = mount(
      <SignupForm submit="Sign Up to JustGiving" onSuccess={(res) => console.log(res)} />
    );
    const button = wrapper.find('button[type="submit"]');

    expect(button.length).to.eql(1);
    expect(button.text()).to.eql('Sign Up to JustGiving');
  });
});
