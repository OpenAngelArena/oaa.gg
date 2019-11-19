import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles(theme => ({
  root: {

  },
  actionIcon: {
    margin: theme.spacing(0, 1)
  }
}));

export default function PlayerList(props) {
  const classes = useStyles();
  const { players, actions } = props;

  function actionHandler(action) {
    return function handler(e) {
      console.log(action);
    }
  }

  function renderButtons(player) {
    if (!actions) {
      return [];
    }
    let playerActions = actions;
    if (typeof actions === 'function') {
      playerActions = actions(player);
    }
    return (
      <ListItemSecondaryAction>
        { playerActions.map((action) => (
          <IconButton
            key={ action.name }
            edge="end"
            aria-label={ action.name }
            className={ classes.actionIcon }
            onClick={ actionHandler(action) }
            >
            <action.icon />
          </IconButton>
        ))}
      </ListItemSecondaryAction>
    );
  }

  return (
    <List className={classes.root}>
      {players.map((player) => (
        <ListItem key={player.steamid} alignItems="flex-start">
          <ListItemAvatar>
            <Avatar alt={player.name} src={player.avatar} />
          </ListItemAvatar>
          <ListItemText
            primary={player.name}
            secondary={
              <>
                {`MMR: ${Math.round(100 * player.mmr) / 100}`}
              </>
            }
          />
          { renderButtons(player) }
        </ListItem>
      ))}
    </List>
  );
}
