import merge from 'lodash/merge';

import { encodeBase64String } from '../../utils/base64';
import { get, jgIdentityClient, post, put, servicesAPI } from '../../utils/client';
import { required } from '../../utils/params';

const deserializeIamResponse = (data) => ({
  ...data.user,
  expiresAt: data.expires_at,
  refreshToken: data.refresh_token,
  token: data.access_token,
  userId: data.id,
});

export const resetPassword = ({ email = required() }) =>
  servicesAPI
    .post('/v1/justgiving/iam/reset-password', { email })
    .catch((error) => Promise.reject(error.response));

export const validateToken = (token = required()) =>
  jgIdentityClient
    .get(`/connect/accesstokenvalidation?token=${token}`)
    .then((response) => ({ ...response.data, valid: true }))
    .catch(({ response }) => ({ ...response.data, valid: false }));

export const signIn = ({ email = required(), password = required(), authType = 'Bearer' }) => {
  if (authType === 'Basic') {
    const token = encodeBase64String(`${email}:${password}`);

    return get(
      '/v1/account',
      {},
      {},
      {
        headers: {
          Authorization: `Basic ${token}`,
        },
      }
    ).then((data) => ({
      address: data.address,
      email: data.email,
      name: [data.firstName, data.lastName].join(' '),
      token,
      userId: data.userId,
    }));
  }

  return servicesAPI
    .post('/v1/justgiving/iam/login', { email, password })
    .then((response) => deserializeIamResponse(response.data))
    .catch((error) => Promise.reject(error.response));
};

export const signUp = ({
  firstName = required(),
  lastName = required(),
  email = required(),
  password = required(),
  address,
  title,
  cause,
  phone,
  reference,
  authType = 'Bearer',
}) => {
  if (authType === 'Basic') {
    const payload = {
      acceptTermsAndConditions: true,
      firstName,
      lastName,
      email,
      password,
      title,
      address,
      reference,
      causeId: cause,
    };

    const request = address ? put('/v1/account', payload) : post('/v1/account/lite', payload);

    return request.then((data) => ({
      address,
      country: data.country,
      email,
      firstName,
      lastName,
      name: [firstName, lastName].join(' '),
      token: encodeBase64String(`${email}:${password}`),
    }));
  }

  return servicesAPI
    .post(
      '/v1/justgiving/iam/register',
      merge(
        {
          firstName,
          lastName,
          email,
          password,
          phone,
        },
        address
          ? {
              streetAddress: address.line1 || address.streetAddress,
              extendedAddress: address.line2 || address.extendedAddress,
              locality: address.townOrCity || address.locality,
              region: address.countyOrState || address.region,
              country: address.country || address.country,
              postCode: address.postcodeOrZipcode || address.postCode,
            }
          : {}
      )
    )
    .then((response) => deserializeIamResponse(response.data))
    .catch((error) => Promise.reject(error.response));
};

export const checkAccountAvailability = (email) => {
  return get(`/v1/account/${email}`)
    .then(() => true)
    .catch(() => false);
};

export const connectToken = (data) => {
  return servicesAPI
    .post('/v1/justgiving/oauth/connect', data)
    .then((response) => deserializeIamResponse(response.data))
    .catch((error) => Promise.reject(error.response));
};

export const refreshToken = (data) => {
  return servicesAPI
    .post('/v1/justgiving/token/refresh', data)
    .then((response) => deserializeIamResponse(response.data))
    .catch((error) => Promise.reject(error.response));
};
