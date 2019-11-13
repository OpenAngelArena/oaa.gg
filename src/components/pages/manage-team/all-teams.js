import React, { useState, useEffect } from 'react';

import { listTeams } from '../../../api/team';
import StandardPage from '../standard-page';
import Loading from './loading';
import TeamList from './team-list';

export default function AllTeams() {
  const [teamList, setTeamList] = useState();

  useEffect(() => {
    async function getTeamList() {
      const data = await listTeams();
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
