import React, { Component } from "react";
import PropTypes from "prop-types";
import get from "lodash/get";
import merge from "lodash/merge";
import withForm from "constructicon/with-form";
import * as validators from "constructicon/lib/validators";
import { signIn } from "../../api/authentication";
import { renderInput, renderFormFields } from "../../utils/form";
import Bugsnag from "@bugsnag/js";

import Form from "constructicon/form";
import ResetPasswordIam from "../reset-password-iam";

class LoginForm extends Component {
  constructor() {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.state = {
      status: "empty",
      errors: [],
    };
  }

  handleSubmit(e) {
    e.preventDefault();

    const { authType, form, onSuccess } = this.props;

    return form.submit().then((data) => {
      this.setState({
        errors: [],
        status: "fetching",
      });

      return signIn({
        authType,
        ...data,
      })
        .then(onSuccess)
        .then(() => this.setState({ status: "fetched" }))
        .catch((error) => {
          const message = get(error, "data.error.message");
          const code = get(error, "data.Code");
          Bugsnag.notify(`LOGIN ERROR - ${error.status} -  ${message}`);

          switch (error.status) {
            case 400:
            case 401:
            case 403:
              if (code && code.toUpperCase() === "AJG6") {
                return this.setState({
                  status: "failed",
                  errors: [
                    {
                      message:
                        "Users linked to a charity are not allowed to login this way. Please login with a standalone JustGiving account.",
                    },
                  ],
                });
              }

              if (code && code.toUpperCase() === "PW001") {
                form.resetForm();

                return this.setState({
                  status: "password_complexity",
                });
              }

              return this.setState({
                status: "failed",
                errors: [{ message: "Invalid Email or Password." }],
              });
            case 404:
              return this.setState({
                status: "failed",
                errors: [{ message: "Invalid Email or Password." }],
              });
            default:
              return this.setState({
                status: "failed",
                errors: message ? [{ message }] : [],
              });
          }
        });
    });
  }

  render() {
    const { disableInvalidForm, form, formComponent, inputField, submit } =
      this.props;

    const { status, errors } = this.state;

    if (status === "password_complexity") {
      return (
        <ResetPasswordIam
          formComponent={formComponent}
          emailAddress={form.fields.email.value}
          onSuccess={() => this.setState({ status: "empty" })}
        />
      );
    }

    return (
      <Form
        errors={errors}
        isDisabled={disableInvalidForm && form.invalid}
        isLoading={status === "fetching"}
        noValidate
        onSubmit={this.handleSubmit}
        icon={
          status === "fetching"
            ? { name: "loading", spin: true }
            : { name: "lock" }
        }
        submit={submit}
        {...formComponent}
      >
        {renderFormFields(form.fields).map((field) => {
          const Tag = renderInput(field.type);
          return <Tag key={field.name} {...field} {...inputField} />;
        })}
      </Form>
    );
  }
}

LoginForm.propTypes = {
  /**
   * Disable form submission when invalid
   */
  disableInvalidForm: PropTypes.bool,

  /**
   * Fields to be passed to the form HOC
   */
  fields: PropTypes.object,

  /**
   * Props to be passed to the Form component
   */
  formComponent: PropTypes.object,

  /**
   * Props to be passed to the InputField component
   */
  inputField: PropTypes.object,

  /**
   * The onSuccess event handler
   */
  onSuccess: PropTypes.func.isRequired,

  /**
   * The label for the form submit button
   */
  submit: PropTypes.string,
};

LoginForm.defaultProps = {
  authType: "Bearer",
  disableInvalidForm: false,
  fields: {},
  formComponent: {
    submitProps: {
      background: "justgiving",
      foreground: "light",
    },
  },
  submit: "Log in to JustGiving",
};

const form = (props) => ({
  fields: merge(
    {
      email: {
        label: "Email address",
        type: "email",
        order: 1,
        required: true,
        validators: [
          validators.required("Email is a required field"),
          validators.email("Must be a valid email"),
        ],
      },
      password: {
        label: "Password",
        type: "password",
        order: 2,
        required: true,
        validators: [validators.required("Password is a required field")],
      },
    },
    props.fields
  ),
});

export default withForm(form)(LoginForm);
