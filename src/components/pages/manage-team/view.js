import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { getTeamData } from '../../../api/team';
import StandardPage from '../standard-page';
import Loading from './loading';
import PlayerList from './player-list';

const useStyles = makeStyles(theme => ({
  statBox: {
    padding: theme.spacing(1, 0, 3, 0)
  }
}));

function Overview() {
  const [teamData, setTeamData] = useState();
  const classes = useStyles();
  const params = useParams();
  const token = params[0];

  useEffect(() => {
    async function updateToken() {
      const data = await getTeamData(token);
      setTeamData(data.team);
    }
    if (!teamData) {
      updateToken();
    }
  }, [teamData, token]);

  if (!teamData) {
    return <Loading />;
  }

  return (
    <StandardPage>
      <Typography variant="h2">
        { teamData.name }
      </Typography>
      <Divider />
      <br />
      <br />
      <PlayerList players={teamData.players.filter((p) => p.confirmed)} />
    </StandardPage>
  );
}

export default Overview;
