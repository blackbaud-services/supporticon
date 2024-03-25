import React from "react";
import CreateFitnessForm from "..";

import { instance } from "../../../utils/client";

describe("Components | CreateFitnessForm", () => {
  beforeEach(() => {
    moxios.install(instance);
  });

  afterEach(() => {
    moxios.uninstall(instance);
  });

  it("renders a simple create fitness form", () => {
    const wrapper = mount(
      <CreateFitnessForm
        token="xxxx"
        userId="12345"
        pageId="54321"
        onSuccess={(res) => console.log(res)}
      />
    );
    const inputs = wrapper.find("input");
    const button = wrapper.find("button");

    expect(inputs.length).to.eql(4);
    expect(button.length).to.eql(1);
    expect(button.text()).to.eql("Log fitness activity");
  });

  it("allows a custom submit button label to be passed", () => {
    const wrapper = mount(
      <CreateFitnessForm
        token="xxxx"
        userId="12345"
        pageId="54321"
        submit="Create fitness activity on JustGiving"
        onSuccess={(res) => console.log(res)}
      />
    );
    const button = wrapper.find("button");

    expect(button.length).to.eql(1);
    expect(button.text()).to.eql("Create fitness activity on JustGiving");
  });
});
