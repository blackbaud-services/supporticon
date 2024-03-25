import React, { Component } from "react";
import omit from "lodash/omit";
import PropTypes from "prop-types";
import debounce from "lodash/debounce";
import { fetchPage } from "../../api/pages";

import InputField from "constructicon/input-field";

class InputSlug extends Component {
  constructor() {
    super();
    this.fetchPageSlug = debounce(this.fetchPageSlug.bind(this), 500);
    this.state = {
      status: "fetched",
      slug: null,
      validations: [],
    };
  }

  fetchPageSlug(slug) {
    this.setState({
      slug,
      validations: [],
      status: slug ? "fetching" : "fetched",
    });

    if (slug) {
      this.props.onBlur && this.props.onBlur(slug);

      fetchPage(slug)
        .then(() => {
          this.props.handleFetch(false);
          this.setState({
            validations: [
              `The URL '${slug}' is not available. Please try a different value.`,
            ],
            status: "failed",
          });
        })
        .catch(({ status }) => {
          if (status === 404) {
            this.setState({ validations: [], status: "fetched" });
            this.props.handleFetch(true);
          }
        });
    }
  }

  render() {
    const { status, slug } = this.state;
    const { validations = [], touched, ...props } = this.props;
    const errors = validations.concat(this.state.validations);

    return (
      <InputField
        {...omit(props, ["handleFetch"])}
        type="search"
        autoComplete="off"
        status={slug && status}
        onKeyUp={(e) => this.fetchPageSlug(e.target.value)}
        error={touched && !!errors.length}
        invalid={!!errors.length}
        validations={errors}
      />
    );
  }
}

InputSlug.propTypes = {
  /**
   * The change handler
   */
  handleFetch: PropTypes.func.isRequired,
};

export default InputSlug;
