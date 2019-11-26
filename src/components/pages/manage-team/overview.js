import React, { useState, useEffect } from 'react';
import { If } from 'react-extras';
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

import CancelIcon from '@material-ui/icons/Cancel';
import PencilIcon from '@material-ui/icons/Edit';
import RefreshIcon from '@material-ui/icons/Refresh';
import SaveIcon from '@material-ui/icons/Save';

import { getInvite, createInvite, setTeamName } from '../../../api/team';
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
  },
  textField: {
    '& input': {
      fontSize: '3rem',
    }
  },
}));

function Overview() {
  const [inviteToken, setInviteToken] = useState('');
  const [userState, userActions] = useUserState();
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [editingTeamName, setEditingTeamName] = useState(false);
  const [currentTeamName, setCurrentTeamName] = useState('');

  useEffect(() => {
    async function updateToken() {
      const token = await getInvite();
      setInviteToken(token);
    }
    updateToken();
  }, []);

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

  function editTeamName() {
    setEditingTeamName(true);
    setCurrentTeamName(team.name);
  }

  async function saveTeamName() {
    const { team: newTeam } = await setTeamName(currentTeamName);
    userActions.updateTeam(newTeam);
    setEditingTeamName(false);
  }

  return (
    <>
      <If condition={!editingTeamName} render={() => (
        <Typography variant="h3">
          Team: { team.name }
          <IconButton onClick={editTeamName}>
            <PencilIcon />
          </IconButton>
        </Typography>
      )} />
      <If condition={!!editingTeamName} render={() => (
        <Typography variant="h3">
          <TextField
            classes={{
              root: classes.textField
            }}
            autoFocus
            title='Team name'
            value={currentTeamName}
            onChange={(e) => setCurrentTeamName(e.target.value)}
            />
            <IconButton onClick={saveTeamName}>
              <SaveIcon />
            </IconButton>
            <IconButton onClick={() => setEditingTeamName(false)}>
              <CancelIcon />
            </IconButton>
        </Typography>
      )} />
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
