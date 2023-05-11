import React from 'react';
import { Redirect } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import document from 'global/document';

import Button from '@material-ui/core/Button';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { useUserState } from './auth';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  },
}));

function Login() {
  const [userState, userActions] = useUserState();
  const classes = useStyles();

  if (userState.user) {
    return <Redirect to="/" />;
  }

  userActions.login();

  let authUrl = `https://chrisinajar.com:2053/auth/authenticate`;
  if (document.location.origin.indexOf('localhost') !== -1) {
    authUrl = `http://localhost:9969/auth/authenticate`;
  }

  return (
    <Container>
      <br />
      <br />
      <br />
      <Paper align="center" className={ classes.root }>
        <Typography paragraph>
          Log in using steam! This will give oaa.gg permission to read your name, steam id, avatar, and other public information.
        </Typography>
        <Typography paragraph>
        Always check the address bar at the top when logging in with Steam, never put your password into a website not owned by Valve.
        </Typography>
        <br />
        <Button variant="contained" onClick={ ()=> document.location.href=authUrl }>
          Log In
        </Button>
      </Paper>
    </Container>
  );
}

export default Login;
