import React, { useState } from 'react';
import { If } from 'react-extras';
import { Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import { impersonate } from '../../../api/admin';
import { useUserState } from '../../auth';
import StandardPage from '../standard-page';

const useStyles = makeStyles(theme => ({
  root: {
  }
}));

export default function ImpersonateUser() {
  const classes = useStyles();
  const [impersonateSteamId, setImpersonateSteamId] = useState('232219850');
  const [loadingImpersonate, setLoadingImpersonate] = useState(false);
  const [impersonateToken, setImpersonateToken] = useState(null);

  async function handleImpersonate() {
    setLoadingImpersonate(true);
    const data = await impersonate(impersonateSteamId);
    setLoadingImpersonate(false);
    if (data.token) {
      setImpersonateToken(data.token);
    }
  }

  return (
    <>
      <If
        condition={!impersonateToken}
        render={() => (
          <>
            <TextField
              value={impersonateSteamId}
              label="Impersonate user"
              placeholder="steam id32"
              name="steamid"
              onChange={(e) => setImpersonateSteamId(e.target.value)}
              disabled={loadingImpersonate}
              />
            <Button
              variant="contained"
              color="primary"
              onClick={handleImpersonate}
              disabled={loadingImpersonate}
              >
              Impersonate
            </Button>
          </>
        )} />
      <If
        condition={!!impersonateToken}
        render={() => (
          <>
            <a href={`/impersonate/${impersonateToken}`} target="_blank">
            <Button
              variant="contained"
              color="primary"
              disabled={loadingImpersonate}
              >
              Impersonate
            </Button>
            </a>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => setImpersonateToken()}
              disabled={loadingImpersonate}
              >
              Cancel
            </Button>
          </>
        )} />
    </>
  );
}
