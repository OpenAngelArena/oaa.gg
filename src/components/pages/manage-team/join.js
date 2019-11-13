import React, { useState, useEffect } from 'react';
import { useParams, useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import Divider from '@material-ui/core/Divider';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { checkInvite, joinTeam } from '../../../api/team';
import { useUserState } from '../../auth';
import StandardPage from '../standard-page';

const useStyles = makeStyles(theme => ({
  statBox: {
    padding: theme.spacing(1, 0, 3, 0)
  }
}));

function JoinTeam() {
  const [isLoading, setIsLoading] = useState();
  const [teamData, setTeamData] = useState();
  const params = useParams();
  const history = useHistory();
  const token = params[0];

  useEffect(() => {
    async function getTeamData() {
      const newData = await checkInvite(token);
      setTeamData(newData.team);
    }
    if (!teamData) {
      getTeamData();
    }
  }, [teamData]);

  async function confirm() {
    setIsLoading(true);
    try {
      const { team } = await joinTeam(token);
      history.push(`/team/view/${team.id}`);
    } catch (e) {
      setIsLoading(false);
      return;
    }
  }

  function cancel() {
    history.push('/team');
  }

  if (isLoading || !teamData) {
    const reason = isLoading ? `Joining ${teamData.name}` : 'Checking invite code...';
    return (
      <StandardPage>
        <Typography variant="h4">{reason}</Typography>
        <br />
        <br />
        <CircularProgress />
      </StandardPage>
    );
  }

  return (
    <StandardPage>
      <Typography variant="h4">
        Do you want to join team
      </Typography>
      <Typography variant="h1">
        {teamData.name}
      </Typography>

      <br />
      <Typography>
        You can join as many teams as you'd like, however only one of those teams may compete in league play.
      </Typography>
      <br />

      <Grid container>
        <Grid item xs={false} sm={1} />
        <Grid item xs={12} sm={4}>
          <Button onClick={confirm} variant="contained" color="primary">JOIN TEAM</Button>
        </Grid>
        <Grid item xs={false} sm={2} />
        <Grid item xs={12} sm={4}>
          <Button onClick={cancel} variant="contained" color="secondary">REJECT INVITE</Button>
        </Grid>
        <Grid item xs={false} sm={1} />
      </Grid>
    </StandardPage>
  );
}

export default JoinTeam;
