import React from 'react';
import { useHistory } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';
import { partial } from 'ap';

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
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
  const { teams, actions = [] } = props;

  function viewTeam(team) {
    return (e) => {
      history.push(`/team/view/${team.id}`);
      e.preventDefault();
    };
  }

  function renderAction(team, action) {
    return (
      <Button key={action.name} onClick={partial(action.action, team, action)}>
      { action.name }
      </Button>
    );
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
            <Button onClick={viewTeam(team)}>
              {team.name}
            </Button>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            {actions.map(partial(renderAction, team))}
            <PlayerList players={ team.players.filter((p) => p.confirmed) } />
          </ExpansionPanelDetails>
        </ExpansionPanel>
      ))}
    </>
  );
}
