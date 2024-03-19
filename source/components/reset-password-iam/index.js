import React, { useState } from "react";
import merge from "lodash/merge";
import Form from "constructicon/form";
import withForm from "constructicon/with-form";
import * as validators from "constructicon/lib/validators";
import { renderInput, renderFormFields } from "../../utils/form";
import PasswordValidations from "../password-validations";
import { servicesAPI } from "../../utils/client";

const ResetPasswordIam = ({ form, formComponent, onSuccess }) => {
  const [errors, setErrors] = useState([]);
  const [status, setStatus] = useState("empty");
  const handleSubmit = (e) => {
    e.preventDefault();
    setErrors([]);

    return form.submit().then((data) => {
      const { email: emailAddress, password: newPassword, oldPassword } = data;
      setStatus("fetching");
      servicesAPI
        .post("/v1/justgiving/iam/reset-password-token", {
          emailAddress,
          password: oldPassword,
        })
        .then(({ data }) => {
          const { PasswordResetToken, UserGuid } = data.Result;

          if (!PasswordResetToken || !UserGuid) {
            setStatus("empty");
            setErrors([{ message: "Username or Password is incorrect" }]);
            return;
          }

          return servicesAPI
            .post("/v1/justgiving/iam/reset-password-iam", {
              token: PasswordResetToken,
              password: newPassword,
              confirmPassword: newPassword,
              userGuid: UserGuid,
            })
            .then(() => {
              setStatus("empty");
              onSuccess();
            });
        });
    });
  };
  return (
    <div>
      <h3>Your password does not meet the complexity requirements.</h3>
      <p>Please choose a new password</p>
      <Form
        errors={errors}
        isLoading={status === "fetching"}
        onSubmit={handleSubmit}
        icon={
          status === "fetching" ? { name: "loading", spin: true } : { name: "" }
        }
        submit="Reset Password"
        {...formComponent}
      >
        {renderFormFields(form.fields).map((field) => {
          const Tag = renderInput(field.type);
          return <Tag key={field.name} {...field} />;
        })}
        <PasswordValidations form={form} />
      </Form>
    </div>
  );
};

const form = (props) => ({
  fields: merge(
    {
      email: {
        label: "Email address",
        type: "email",
        initial: props.emailAddress,
        order: 1,
        required: true,
        validators: [
          validators.required("Email is a required field"),
          validators.email("Must be a valid email"),
        ],
      },
      oldPassword: {
        label: "Old Password",
        type: "password",
        order: 2,
        required: true,
        validators: [validators.required("Old Password is a required field")],
      },
      password: {
        label: "New Password",
        type: "password",
        order: 3,
        required: true,
        validators: [validators.required("New Password is a required field")],
      },
    },
    props.fields
  ),
});

export default withForm(form)(ResetPasswordIam);
