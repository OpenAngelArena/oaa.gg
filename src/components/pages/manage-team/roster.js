import React, { useState, useEffect } from 'react';

import ExitToAppIcon from '@material-ui/icons/ExitToApp';

import { removePlayer } from '../../../api/team';
import { useUserState, useTokenRefresher } from '../../auth';
import PlayerList from './player-list';

export default function TeamRoster(props) {
  const [userState, userActions] = useUserState();
  const refreshToken = useTokenRefresher();
  let { players } = userState.user.team;

  players = players.filter((p) => p.confirmed);

  async function removePlayerAction(player) {
    await removePlayer(player.steamid);
    refreshToken();
  }

  function getActions(player) {
    // if (player.steamid === userState.user.steamid) {
    //   return null;
    // }
    return [{
      icon: ExitToAppIcon,
      name: 'Remove Player',
      action: removePlayerAction
    }];
  }

  return (
    <PlayerList players={players} actions={getActions} />
  );
}
