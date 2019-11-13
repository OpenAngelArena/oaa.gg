import React, { useState, useEffect } from 'react';

import Avatar from '@material-ui/core/Avatar';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';

import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import { listTeams } from '../../../api/team';
import { useUserState } from '../../auth';
import StandardPage from '../standard-page';
import Loading from './loading';
import TeamList from './team-list';

export default function MyTeams() {
  const [teamList, setTeamList] = useState();
  const [userState, userActions] = useUserState();

  useEffect(() => {
    async function getTeamList() {
      const data = await listTeams(userState.user.steamid);
      setTeamList(data);
    }
    if (!teamList) {
      getTeamList();
    }
  }, [teamList]);

  if (!teamList) {
    return <Loading />;
  }

  return (
    <StandardPage>
      <TeamList teams={teamList} />
    </StandardPage>
  );
}
