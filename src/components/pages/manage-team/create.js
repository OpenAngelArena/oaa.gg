import React, { useState, useEffect } from 'react';
import { Redirect } from "react-router-dom";
import { If } from 'react-extras';
import { timeout } from 'thyming';
import Request from 'config-request';
import storage from 'any-storage';
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import FormControl from '@material-ui/core/FormControl';
import Grid from '@material-ui/core/Grid';
import TextField from '@material-ui/core/TextField';
import Typography from '@material-ui/core/Typography';

import StandardPage from '../standard-page';
import { useUserState } from '../../auth';
import { createTeam } from '../../../api/team';

const useStyles = makeStyles(theme => ({
  buttonProgress: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
}));

function useTeamWizard() {
  const [buttonDisabled, setButtonDisabled] = useState(false);
  const [creationStep, setCreationStep] = useState(0);
  const [teamName, setTeamName] = useState('');
  const [userState, userActions] = useUserState();

  useEffect(() => {
    console.log('Check', creationStep);
    switch (creationStep) {
      case 0:
        return timeout(() => {
          setCreationStep(1);
        }, 2000);
        break;
      default:
        break;
    }
  }, [creationStep]);

  function submitTeamName() {
    setCreationStep(2);
  }

  async function createTeamAction() {
    setButtonDisabled(true);
    const { token } = await createTeam(teamName);
    storage.set('authentication', token, () => userActions.login());
  }

  return [{
    teamName,
    creationStep,
    buttonDisabled,
    userState
  }, {
    setTeamName,
    submitTeamName,
    createTeam: createTeamAction
  }];
}

function CreateTeam() {
  const [state, actions] = useTeamWizard();
  const classes = useStyles();

  if (state.userState.user.team) {
    return <Redirect to="/team" />;
  }

  function nextButton() {
    return (
      <Button
        color="primary"
        variant="contained"
        onClick={actions.submitTeamName}
        >
        Next
      </Button>
    );
  }

  // creationStep
  switch (state.creationStep) {
    case 0:
      return (
        <>
          <Typography variant="h2">
            Create a team
          </Typography>
          <br />
          <Typography variant="subtitle1">
            Win the game, make some money
          </Typography>
        </>
      );
      break;
    case 1:
      // set name
      return (
        <>
          <Typography variant="h2">
            Create a team
          </Typography>
          <br />
          <Typography variant="subtitle1">
            Enter your team name below
          </Typography>
          <Container maxWidth="sm" align="center">
            <Grid container>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <TextField
                    placeholder="Team Name"
                    helperText="You can change this later"
                    value={state.teamName}
                    required
                    onChange={(e)=> actions.setTeamName(e.target.value)}
                    />
                </FormControl>
              </Grid>
              <Grid item xs={6}>
                <If
                  condition={ !!state.teamName.length }
                  render={nextButton}
                />
              </Grid>
            </Grid>
          </Container>
        </>
      );
      break;
    case 2:
      return (
        <>
          <Typography variant="h2">
            Team {state.teamName}
          </Typography>
          <br />
          <Container maxWidth="sm">
            <Typography paragraph>
              Your team will be active once you have 5 players add and confirmed, and then all 5 of you play a game together.
              Games played before registering the team or before roster changes do not count.
            </Typography>
          </Container>
          <div className={classes.wrapper}>
            <Button
              color="primary"
              variant="contained"
              onClick={ actions.createTeam }
              disabled={ state.buttonDisabled }
              >
              Create Team
            </Button>
            {state.buttonDisabled && <CircularProgress size={24} className={classes.buttonProgress}/>}
          </div>
        </>
      );
      break;
  }

  return null;
}

function CreateTeamPage() {
  return (
    <StandardPage>
      <CreateTeam />
    </StandardPage>
  );
}

export default CreateTeamPage;
