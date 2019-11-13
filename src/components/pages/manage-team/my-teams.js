import React, { useState, useEffect } from 'react';

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
