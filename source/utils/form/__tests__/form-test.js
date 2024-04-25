import React from "react";
import { renderInput, renderFormFields } from "..";

describe("Utils | Form", () => {
  describe("renderInput", () => {
    it("defaults to InputField", () => {
      const Tag = renderInput("text");
      const wrapper = mount(
        <Tag name="input" onChange={(e) => console.log(e)} />
      );

      const input = wrapper.find("InputField");
      expect(input.length).to.eql(1);
    });

    it("renders an InputSearch", () => {
      const Tag = renderInput("search");
      const wrapper = mount(
        <Tag name="input" onSearch={(e) => console.log(e)} />
      );

      const input = wrapper.find("InputSearch");
      expect(input.length).to.eql(1);
    });

    it("renders an InputDate", () => {
      const Tag = renderInput("date");
      const wrapper = mount(
        <Tag name="input" onChange={(e) => console.log(e)} />
      );

      const input = wrapper.find("InputDate");
      expect(input.length).to.eql(1);
    });

    it("renders an InputSelect", () => {
      const Tag = renderInput("select");
      const wrapper = mount(
        <Tag
          name="input"
          label="Label"
          options={[{ value: "Test", label: "Test" }]}
          onChange={(e) => console.log(e)}
        />
      );

      const input = wrapper.find("InputSelect");
      expect(input.length).to.eql(1);
    });
  });

  describe("renderFormFields", () => {
    it("returns the correct fields", () => {
      const fields = {
        name: { name: "name", order: 1 },
        email: { name: "email", order: 2 },
        password: { name: "password", order: 3 },
        custom: { name: "test", order: 4 },
      };

      const test = renderFormFields(fields, ["email"]);
      expect(test.length).to.eql(3);
      expect(test.map(({ name }) => name)).to.eql(["name", "password", "test"]);
      expect(JSON.stringify(test)).to.include(
        JSON.stringify({ name: "name", order: 1 })
      );
    });
  });
});
