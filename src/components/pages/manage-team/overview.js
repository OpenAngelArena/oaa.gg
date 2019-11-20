import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import document from 'global';
import copy from 'clipboard-copy';

import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import { getInvite } from '../../../api/team';
import { useUserState } from '../../auth';
import StandardPage from '../standard-page';
import NoTeam from './no-team';
import PlayerList from './player-list';
import PendingPlayers from './pending-players';
import TeamRoster from './roster';

const useStyles = makeStyles(theme => ({
  root: {
  }
}));

function Overview() {
  const [inviteToken, setInviteToken] = useState('');
  const [userState] = useUserState();
  const classes = useStyles();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    async function updateToken() {
      const token = await getInvite();
      setInviteToken(token);
    }
    if (!inviteToken.length) {
      updateToken();
    }
  }, [inviteToken]);

  const { team, profile } = userState.user;

  const inviteLink = inviteToken.length ? `${document.location.origin}/team/join/${inviteToken}` : '';

  if (!team) {
    return <NoTeam />;
  }

  function copyInviteUrl(e) {
    setOpen(true);
    copy(inviteLink);
    if (e && e.target && e.target.select) {
      e.target.select();
    }
  }

  return (
    <>
      <Typography variant="h3">
        Team: { team.name }
      </Typography>
      <Divider />
      <br />
      <Typography>
        Invite player using this link
      </Typography>
      <Container maxWidth="md">
        <Grid container>
          <Grid
            item
            md={6}
            xs={12}
            >
            <Typography variant="h5">
              Invite players
            </Typography>
            <Tooltip
              open={open}
              title="Copied"
              placement="bottom-end"
              >
              <TextField
                fullWidth
                value={inviteLink}
                label="Invite Link"
                placeholder="Loading link..."
                onClick={copyInviteUrl}
                onBlur={() => setOpen(false)}
                />
            </Tooltip>
            <br />
            <br />
            <br />
            <Typography variant="h5">
              Pending players
            </Typography>
            <PendingPlayers />
          </Grid>
          <Grid
            item
            md={6}
            xs={12}
            >
            <Typography variant="h5">
              Team Roster
            </Typography>
            <TeamRoster />
          </Grid>
        </Grid>
      </Container>
    </>
  );
}

export default Overview;
