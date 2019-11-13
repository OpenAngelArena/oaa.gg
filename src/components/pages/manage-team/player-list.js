import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Avatar from '@material-ui/core/Avatar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';


const useStyles = makeStyles(theme => ({
  root: {

  }
}));

export default function PlayerList(props) {
  const classes = useStyles();
  const { players } = props;

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
        </ListItem>
      ))}
    </List>
  );
}
