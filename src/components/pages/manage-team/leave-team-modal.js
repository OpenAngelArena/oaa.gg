import React, { useState, useEffect } from 'react';
import { If } from 'react-extras';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';
import Modal from '@material-ui/core/Modal';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { leaveTeam } from '../../../api/team';

const useStyles = makeStyles(theme => ({
  paper: {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    position: 'absolute',
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    outline: 'none',
  },
}));

export default function LeaveTeamModal(props) {
  const { team, open, onClose, onNewTeam } = props;
  const classes = useStyles();
  const [loading, setLoading] = useState(false);

  async function handleLeaveTeam() {
    setLoading(true);
    const { team: newTeam } = await leaveTeam(team.id);
    console.log(newTeam);
    if (typeof onNewTeam === 'function') {
      onNewTeam(newTeam);
    }
    if (typeof onClose === 'function') {
      onClose();
    }
  }

  function renderActions() {
    return (
      <Grid container>
        <Grid item xs={6}>
          <Button variant="contained" color="primary" onClick={onClose}>
            Cancel
          </Button>
        </Grid>
        <Grid item xs={6}>
          <Button variant="contained" color="secondary" onClick={handleLeaveTeam}>
            Leave Team
          </Button>
        </Grid>
      </Grid>
    );
  }

  function renderLoading() {
    return (
      <CircularProgress size={32} />
    );
  }

  return (
    <>
      <Modal
        disablePortal
        disableEnforceFocus
        disableAutoFocus
        open={team && open}
        onClose={onClose}
        >
        <Paper className={classes.paper}>
          <Typography>
            Are you sure you want to leave team:
          </Typography>
          <br />
          <Typography variant='h3'>
            { team.name }
          </Typography>
          <br />
          <If condition={!loading} render={renderActions} />
          <If condition={loading} render={renderLoading} />
        </Paper>
      </Modal>
    </>
  );
}
