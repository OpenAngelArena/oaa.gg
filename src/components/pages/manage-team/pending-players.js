import React, { useState, useEffect } from 'react';
import storage from 'any-storage';

import CheckIcon from '@material-ui/icons/Check';
import ClearIcon from '@material-ui/icons/Clear';

import { acceptInvite, rejectInvite } from '../../../api/team';
import { useUserState, useTokenRefresher } from '../../auth';
import PlayerList from './player-list';

export default function PendingPlayers(props) {
  const [userState, userActions] = useUserState();
  const refreshToken = useTokenRefresher();
  let { players } = userState.user.team;

  players = players.filter((p) => !p.confirmed);

  async function acceptPlayer(player) {
    const { team } = await acceptInvite(player.steamid);
    userActions.updateTeam(team);
    refreshToken();
  }
  async function rejectPlayer(player) {
    const { team } = await rejectInvite(player.steamid);
    userActions.updateTeam(team);
    refreshToken();
  }

  const actions = [{
    icon: CheckIcon,
    name: 'Accept',
    action: acceptPlayer
  }, {
    icon: ClearIcon,
    name: 'Reject',
    action: rejectPlayer
  }];

  return (
    <PlayerList players={players} actions={actions} />
  );
}
