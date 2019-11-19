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
import ImpersonateUser from './impersonate';

const useStyles = makeStyles(theme => ({
  statBox: {
    padding: theme.spacing(1, 0, 3, 0)
  }
}));

export default function Admin() {
  const [userState] = useUserState();
  const classes = useStyles();
  const [impersonateSteamId, setImpersonateSteamId] = useState('232219850');
  const [loadingImpersonate, setLoadingImpersonate] = useState(false);
  const [impersonateToken, setImpersonateToken] = useState(null);

  if (!userState.user.isAdmin) {
    return <Redirect to="/" />
  }

  async function handleImpersonate() {
    setLoadingImpersonate(true);
    const data = await impersonate(impersonateSteamId);
    setLoadingImpersonate(false);
    if (data.token) {
      setImpersonateToken(data.token);
    }
  }

  return (
    <StandardPage>
      <Typography variant="h3">Admin</Typography>
      <Typography variant="subtitle2"><i>ban everyone</i></Typography>
      <br />
      <br />
      <ImpersonateUser />
    </StandardPage>
  );
}
