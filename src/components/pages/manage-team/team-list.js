import React from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import PlayerList from './player-list';


const useStyles = makeStyles(theme => ({
  root: {
  }
}));

export default function TeamList(props) {
  const classes = useStyles();
  const history = useHistory();
  const { teams } = props;

  function viewTeam(team) {
    return (e) => {
      history.push(`/team/view/${team.id}`);
      e.preventDefault();
    };
  }

  return (
    <>
      {teams.map((team) => (
        <ExpansionPanel key={team.id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls={`${team.id}-content`}
            id={`${team.id}-header`}
          >
            <a href="#" onClick={viewTeam(team)}>
              {team.name}
            </a>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <PlayerList players={team.players} />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </>
  );
}
