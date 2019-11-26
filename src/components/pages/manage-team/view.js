import React, { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import Button from '@material-ui/core/Button';
import Divider from '@material-ui/core/Divider';
import Typography from '@material-ui/core/Typography';

import { getTeamData } from '../../../api/team';
import { useUserState } from '../../auth';
import StandardPage from '../standard-page';
import Loading from './loading';
import PlayerList from './player-list';
import LeaveTeamModal from './leave-team-modal';

const useStyles = makeStyles(theme => ({
  statBox: {
    padding: theme.spacing(1, 0, 3, 0)
  }
}));

function Overview() {
  const [teamData, setTeamData] = useState();
  const [showLeaveTeam, setShowLeaveTeam] = useState(false);
  const classes = useStyles();
  const params = useParams();
  const [userState] = useUserState();
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

  let isOnTeam = false;
  teamData.players.forEach((p) => {
    isOnTeam = isOnTeam || p.steamid === userState.user.steamid;
  });

  return (
    <StandardPage>
      <Typography variant="h2">
        { teamData.name }
      </Typography>
      <Divider />
      <br />
      {isOnTeam && (
        <Button variant='contained' color='secondary' onClick={() => setShowLeaveTeam(true)}>
          Leave team
        </Button>
      )}
      <LeaveTeamModal
        open={showLeaveTeam}
        team={teamData}
        onNewTeam={setTeamData}
        onClose={() => setShowLeaveTeam(false)}
        />
      <br />
      <PlayerList players={teamData.players.filter((p) => p.confirmed)} />
    </StandardPage>
  );
}

export default Overview;
