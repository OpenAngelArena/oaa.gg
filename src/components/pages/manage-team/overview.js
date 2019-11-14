import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import document from 'global';

import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { getInvite } from '../../../api/team';
import { useUserState } from '../../auth';
import StandardPage from '../standard-page';
import NoTeam from './no-team';

const useStyles = makeStyles(theme => ({
  statBox: {
    padding: theme.spacing(1, 0, 3, 0)
  }
}));

function Overview() {
  const [inviteToken, setInviteToken] = useState();
  const [userState] = useUserState();
  const classes = useStyles();

  useEffect(() => {
    async function updateToken() {
      const token = await getInvite();
      setInviteToken(token);
    }
    if (!inviteToken) {
      updateToken();
    }
  }, [inviteToken]);

  const { team, profile } = userState.user;

  const inviteLink = `${document.location.origin}/team/join/${inviteToken}`;

  if (!team) {
    return <NoTeam />;
  }
  return (
    <>
      <Typography variant="h3">
        Team: { team.name }
      </Typography>
      <Divider />
      <br />
      <Typography>
        Invite player using this link:&nbsp;
        { inviteLink ? (<a href={ inviteLink }>{ inviteLink }</a>) : 'Loading...' }
      </Typography>
    </>
  );
}

export default Overview;
