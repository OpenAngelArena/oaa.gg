import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import document from 'global';
import copy from 'clipboard-copy';

import Container from '@material-ui/core/Container';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';

import RefreshIcon from '@material-ui/icons/Refresh';

import { getInvite, createInvite } from '../../../api/team';
import { useUserState } from '../../auth';
import NoTeam from './no-team';
import PendingPlayers from './pending-players';
import TeamRoster from './roster';

const useStyles = makeStyles(theme => ({
  root: {
  },
  inviteHolder: {
    display: 'flex'
  },
  inviteBox: {
    flex: 1
  },
  inviteRefresh: {
    flex: 0,
    width: 80,
    transition: 'transform 1s',
    '&:hover': {
      transform: 'rotate(90deg)'
    }
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

  async function generateInvite(e) {
    const token = await createInvite();
    if (token) {
      setInviteToken(token);
    }
  }

  return (
    <>
      <Typography variant="h3">
        Team: { team.name }
      </Typography>
      <Divider />
      <br />
      <Container>
        <Grid container>
          <Grid
            item
            md={6}
            xs={12}
            >
            <Typography variant="h5">
              Invite players
            </Typography>
            <div className={classes.inviteHolder}>
              <div className={classes.inviteBox}>
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
                    className={ classes.invite }
                    />
                </Tooltip>
              </div>
              <div className={classes.inviteRefresh}>
                <Tooltip title="Generate new invite link">
                <IconButton onClick={generateInvite}>
                  <RefreshIcon />
                </IconButton>
                </Tooltip>
              </div>
            </div>
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
