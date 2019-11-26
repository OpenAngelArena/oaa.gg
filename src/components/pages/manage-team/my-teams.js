import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import { listTeams } from '../../../api/team';
import { useUserState } from '../../auth';
import StandardPage from '../standard-page';
import Loading from './loading';
import TeamList from './team-list';
import LeaveTeamModal from './leave-team-modal';

export default function MyTeams() {
  const [teamList, setTeamList] = useState();
  const [leaveTeam, setLeaveTeam] = useState(false);
  const [userState] = useUserState();

  useEffect(() => {
    async function getTeamList() {
      const data = await listTeams(userState.user.steamid);
      setTeamList(data);
    }
    getTeamList();
  }, [userState.user.steamid]);

  function updateTeam(team) {
    setTeamList(teamList.filter((t) => t.id !== team.id));
  }

  if (!teamList) {
    return <Loading />;
  }

  return (
    <StandardPage>
      <TeamList teams={teamList} actions={[{
          name: 'Leave team',
          action: (team) => setLeaveTeam(team)
        }]}/>
      <LeaveTeamModal
        open={!!leaveTeam}
        team={leaveTeam}
        onNewTeam={updateTeam}
        onClose={() => setLeaveTeam(false)}
        />
    </StandardPage>
  );
}
