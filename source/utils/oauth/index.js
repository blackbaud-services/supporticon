import omit from 'lodash/omit';
import URL from 'url-parse';

import { getBaseURL } from '../client';
import { base64EncodeParams, formatUrlParams } from '../params';

export const getConnectUrl = ({
  clientId,
  email,
  forceSignUp,
  homeUrl,
  redirectUri,
  oauthParams,
}) => {
  const hasParams = email || oauthParams;
  const optionsKey = forceSignUp ? 'encodedOptionsignup' : 'encodedOptions';
  const encodedParams = {
    client_id: clientId,
    redirect_uri: redirectUri,
    state: homeUrl && `home=${homeUrl}`,
  };

  const params = {
    acr_values: hasParams
      ? `${optionsKey}:${base64EncodeParams({
          EmailValue: email,
          ...omit(oauthParams, forceSignUp ? 'SignInTitle' : 'SignUpTitle'),
        })}`
      : forceSignUp && 'signup:true',
    response_type: 'code',
    scope: 'openid+profile+email+account+fundraise+offline_access',
  };

  const encodedUrlParams = formatUrlParams(encodedParams, true);
  const urlParams = formatUrlParams(params);
  const baseURL = getBaseURL().replace('api', 'identity');

  return `${baseURL}/connect/authorize?${encodedUrlParams}&${urlParams}`;
};

export const showPopup = ({
  onClose = () => {},
  name = 'Authentication',
  popupWindowFeatures = 'width=600,height=900,status=1',
  url,
}) => {
  const popupWindow = window.open(url, name, popupWindowFeatures);

  const popupInterval = setInterval(() => {
    popupWindow.postMessage('ready', '*');

    if (popupWindow.closed) {
      clearInterval(popupInterval);
      onClose(popupWindow);
    }
  }, 500);
};

export const listenForPostMessage = ({ onSuccess = () => {}, redirectUri }) => {
  const validSourceOrigin = redirectUri && new URL(redirectUri).origin;

  const listener = (e) => {
    const { data } = e;
    const isValid = e.origin === validSourceOrigin;

    if (isValid) {
      onSuccess(data);
    }
  };

  window.addEventListener('message', listener, false);
};
