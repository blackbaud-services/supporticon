import * as validators from "constructicon/lib/validators";

export default () => ({
  fields: {
    name: {
      label: "Team name",
      placeholder: "Enter your team name",
      validators: [
        validators.alphaNumericSpecial(
          "Team name must be only letters or numbers"
        ),
      ],
    },
    target: {
      type: "number",
      label: "Fundraising target",
      placeholder: "100",
      validators: [validators.required("Enter your team fundraising target")],
    },
    story: {
      type: "textarea",
      label: "Team story",
      validators: [validators.required("Please enter your team story")],
    },
  },
});
