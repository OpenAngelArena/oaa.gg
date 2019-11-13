import React from 'react';
import { useHistory } from "react-router-dom";

import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

function NoTeam() {
  const history = useHistory();

  function createTeam() {
    history.push('/team/create');
  }

  return (
    <>
      <Typography paragraph>
        You are not currently on any team's roster!
      </Typography>
      <Button variant="contained" onClick={ createTeam }>
        Create Team
      </Button>
      <br />
      <br />
      <Button variant="contained">
        Join Team
      </Button>
    </>
  );
}

export default NoTeam;
