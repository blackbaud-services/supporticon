import * as validators from "constructicon/lib/validators";

export default () => ({
  fields: {
    email: {
      type: "email",
      placeholder: "Enter your email address",
      validators: [
        validators.required("Please enter your email address"),
        validators.email("Please enter a valid email address"),
      ],
    },
  },
});
