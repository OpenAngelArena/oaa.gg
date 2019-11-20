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
  hasUpdated: false,
  isImpersionation: false
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
  updateTeam: (store, team) => {
    store.setState({
      user: {...store.state.user,
        team
      }
    });
  },
  login: (store) => {
    storage.get('authentication', function(err, _data) {
      let data = _data;
      let isImpersionation = false;
      if (sessionStorage && sessionStorage.impersonate) {
        data = sessionStorage.impersonate;
        isImpersionation = true;
      }
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
      if (isImpersionation) {
        store.setState({
          isImpersionation
        });
      }
      const lastLogin = Date.now() - (new Date(token.iat * 1000));
      if (!store.state.hasUpdated) {
        store.setState({
          hasUpdated: true
        });
        refreshAuthToken((token) => {
          if (isImpersionation) {
            sessionStorage.impersonate = token;
            decodeToken(store, token);
          } else {
            storage.set('authentication', token, (err, token) => decodeToken(store, token));
          }
        });
      }
    });
  }
};

export const useUserState = globalHook(React, initialState, actions);

export function useTokenRefresher() {
  const [userState, userActions] = useUserState();

  function updateAuthToken(token) {
    if (userState.isImpersionation) {
      sessionStorage.impersonate = token;
    } else {
      storage.set('authentication', token, () => userActions.login());
    }
  }

  return () => refreshAuthToken(updateAuthToken);
}

function Auth(props) {
  const { impersonate } = props;
  const { token } = useParams();
  const userActions = useUserState()[1];
  const history = useHistory();

  if (!token || !token.length) {
    return <Redirect to="/" />
  }

  if (impersonate) {
    sessionStorage.impersonate = token;
    userActions.login();
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
