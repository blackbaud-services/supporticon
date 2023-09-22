import Button from 'constructicon/button';
import ButtonGroup from 'constructicon/button-group';
import Form from 'constructicon/form';
import Grid from 'constructicon/grid';
import GridColumn from 'constructicon/grid-column';
import Icon from 'constructicon/icon';
import InputField from 'constructicon/input-field';
import Section from 'constructicon/section';
import withForm from 'constructicon/with-form';
import PropTypes from 'prop-types';
import React from 'react';

import { checkAccountAvailability, connectToken } from '../../api/authentication';
import { getErrorMessage } from '../../utils/errors';
import { getConnectUrl, listenForPostMessage, showPopup } from '../../utils/oauth';
import { parseUrlParams } from '../../utils/params';
import { getCurrentUrl, getIsMobile } from '../../utils/window';
import form from './form';
import JGLogo from './jg-logo';

class JGConnectForm extends React.Component {
  constructor(props) {
    super(props);
    this.handleClose = this.handleClose.bind(this);
    this.handleSuccess = this.handleSuccess.bind(this);
    this.showOAuth = this.showOAuth.bind(this);

    this.state = {
      errors: [],
      status: 'empty',
      confirming: false,
      method: 'signup',
      showButtons: props.showButtons,
    };
  }

  componentDidMount() {
    const { redirectUri } = this.props;
    const data = parseUrlParams();

    listenForPostMessage({ redirectUri, onSuccess: this.handleSuccess });

    if (data.access_token || data.code) {
      return this.handleSuccess(data);
    }
  }

  handleClose() {
    this.setState({ status: 'empty' });
  }

  handleSuccess(data) {
    const { onSuccess } = this.props;
    const { confirming } = this.state;

    if (!confirming) {
      Promise.resolve()
        .then(() => this.setState({ confirming: true }))
        .then(() => connectToken(data))
        .then((data) => onSuccess(data))
        .catch((error) => {
          const errors = [{ message: getErrorMessage(error) }];
          this.setState({ errors, status: 'failed', confirming: false });
        });
    }
  }

  showOAuth(forceSignUp, email) {
    const { clientId, homeUrl, oauthParams, popup, redirectUri } = this.props;
    const isMobile = getIsMobile();

    return Promise.resolve()
      .then(() =>
        this.setState({
          errors: [],
          method: forceSignUp ? 'signup' : 'login',
          status: 'fetching',
        })
      )
      .then(() =>
        getConnectUrl({
          clientId,
          email,
          forceSignUp,
          homeUrl,
          redirectUri,
          oauthParams,
        })
      )
      .then((url) =>
        popup && !isMobile
          ? showPopup({ url, onClose: this.handleClose })
          : (window.location.href = url)
      )
      .catch((error) => {
        const errors = [{ message: getErrorMessage(error) }];
        this.setState({ errors, status: 'failed' });
      });
  }

  render() {
    const { buttonProps, formComponent, inputField, form, label } = this.props;
    const { confirming, errors, method, showButtons, status } = this.state;
    const isLoading = confirming || status === 'fetching';
    const isTouched = showButtons !== this.props.showButtons;

    if (showButtons) {
      return (
        <div>
          <Section tag="h3" spacing={{ b: 0.5 }}>
            {label || (
              <span>
                Do you have an existing <JGLogo /> account?
              </span>
            )}
          </Section>
          <ButtonGroup>
            <Button
              disabled={isLoading}
              background="justgiving"
              foreground="light"
              onClick={() => this.showOAuth(false)}
              {...buttonProps}
            >
              <span>Yes, I do</span>
              {isLoading && method === 'login' && <Icon name="loading" spin />}
            </Button>
            <Button
              disabled={isLoading}
              background="justgiving"
              foreground="light"
              onClick={() => this.showOAuth(true)}
              {...buttonProps}
            >
              <span>No, I don't</span>
              {isLoading && method === 'signup' && <Icon name="loading" spin />}
            </Button>
          </ButtonGroup>
          <Section tag="p" spacing={{ t: 0.5 }}>
            <button onClick={() => this.setState({ showButtons: false })}>I'm not sure</button>
          </Section>
        </div>
      );
    }

    return (
      <Form
        errors={errors}
        isLoading={isLoading}
        noValidate
        onSubmit={(e) => {
          e.preventDefault();

          form.submit().then((values) =>
            Promise.resolve()
              .then(() => this.setState({ status: 'fetching', errors: [] }))
              .then(() => checkAccountAvailability(values.email))
              .then((hasAccount) => this.showOAuth(!hasAccount, values.email))
          );
        }}
        submit=""
        autoComplete="off"
        {...formComponent}
      >
        <Section tag="h3" spacing={{ b: 0.5 }}>
          <label htmlFor="email">
            {label || (
              <span>
                Enter your email below to check if you have an existing <JGLogo /> account
              </span>
            )}
          </label>
        </Section>
        <Grid spacing={{ x: 0.25, y: 0 }}>
          <GridColumn md={9}>
            <InputField autoFocus={isTouched} {...form.fields.email} {...inputField} />
          </GridColumn>
          <GridColumn md={3}>
            <Button
              block
              background="justgiving"
              disabled={isLoading}
              foreground="light"
              type="submit"
              {...buttonProps}
            >
              <span>Next</span>
              {isLoading ? <Icon name="loading" spin /> : <Icon name="chevron" />}
            </Button>
          </GridColumn>
          {isTouched && (
            <GridColumn>
              <button onClick={() => this.setState({ showButtons: true })}>Go back</button>
            </GridColumn>
          )}
        </Grid>
      </Form>
    );
  }
}

JGConnectForm.propTypes = {
  /**
   * Props to be passed to the Button component
   */
  buttonProps: PropTypes.object,

  /**
   * The JG application key
   */
  clientId: PropTypes.string,

  /**
   * Props to be passed to the Form component
   */
  formComponent: PropTypes.object,

  /**
   * Home URL that our oauth handler (oauth.blackbaud-sites.com) will redirect to
   */
  homeUrl: PropTypes.string,

  /**
   * Props to be passed to the InputField components
   */
  inputField: PropTypes.object,

  /**
   * The label at the top of the form
   */
  label: PropTypes.string,

  /**
   * Options to customise the oauth flow - see https://github.com/JustGiving/JG.IdentityAndAccess.Sso/blob/master/src/JG.IdentityAndAccess.Sso.Core/IdentityAndAccess/Models/SingleSignOnOptionsModel.cs
   */
  oauthParams: PropTypes.object,

  /**
   * The function to call when user is successfully authenticated
   */
  onSuccess: PropTypes.func,

  /**
   * Use a popup window for OAuth
   */
  popup: PropTypes.bool,

  /**
   * The url to redirect to on successful authentication
   */
  redirectUri: PropTypes.string,

  /**
   * Show Yes/No buttons instead of an email check form
   */
  showButtons: PropTypes.bool,
};

JGConnectForm.defaultProps = {
  clientId: '44f34c65',
  popup: true,
  homeUrl: getCurrentUrl(),
  redirectUri: 'https://oauth.blackbaud-sites.com/',
};

export default withForm(form)(JGConnectForm);
