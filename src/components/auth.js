import React from 'react';
import globalHook from 'use-global-hook';
import { useParams, useHistory, Redirect } from "react-router-dom";
import storage from 'any-storage';
import Jwt from 'jsonwebtoken';
import Request from 'config-request';
import { partial } from 'ap';

import { refreshAuthToken } from '../api/auth';

const initialState = {
  user: null,
  hasUpdated: false
};

function decodeToken(store, data) {
  const token = Jwt.decode(data);
  Request.configure({
    baseUrl: token.baseUrl,
    token: data,
    authorization: 'x-auth-token',
    options: {
      json: true
    }
  });
  console.log('Logged in successfuly', token);

  store.setState({
    user: {...token.user,
      mmr: Math.round(100 * token.user.unrankedMMR) / 100
    }
  });

  return token;
}

const actions = {
  login: (store) => {
    storage.get('authentication', function(err, data) {
      if (!data) {
        Request.configure({ token: null });
        if (store.state.user !== null) {
          store.setState({
            user: null
          });
        }
        return;
      }
      const token = decodeToken(store, data);
      const lastLogin = Date.now() - (new Date(token.iat * 1000));
      if ((!store.state.hasUpdated && lastLogin > 1000 * 60 * 0.5) || (lastLogin > 1000 * 60 * 5)) {
        refreshAuthToken(partial(decodeToken, store));
      }
    });
  }
};

export const useUserState = globalHook(React, initialState, actions);

function Auth() {
  const { token } = useParams();
  const userActions = useUserState()[1];
  const history = useHistory();

  if (!token || !token.length) {
    return <Redirect to="/" />
  }

  storage.set('authentication', token, () => userActions.login());
  storage.get('route', function(err, data) {
    if (err || !data) {
      history.push('/login');
      return;
    }
    history.push(data);
    storage.remove('route');
  });
  return null;
}

export default Auth;
