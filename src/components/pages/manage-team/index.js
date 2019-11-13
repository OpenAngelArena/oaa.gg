import React from 'react';
import { useParams } from "react-router-dom";
import NoTeam from './no-team';
import CreateTeam from './create';
import Overview from './overview';
import JoinTeam from './join';
import ViewTeam from './view';
import MyTeams from './my-teams';
import ListTeams from './all-teams';
import StandardPage from '../standard-page';
import { useUserState } from '../../auth';

function ManageTeam() {
  const { action } = useParams();
  const [userState, userActions] = useUserState();
  const isOnTeam = !!userState.user.team;

  switch (action) {
    case 'create':
      return <CreateTeam />
      break;
    case 'join':
      return <JoinTeam />
      break;
    case 'view':
      return <ViewTeam />
      break;
    case 'list':
      return <ListTeams />
      break;
    case 'manage':
      return (
        <StandardPage>
          <Overview />
        </StandardPage>
      );
      break;
    default:
      break;
  }

  if (!isOnTeam) {
    return (
      <StandardPage>
        <NoTeam />
      </StandardPage>
    );
  }

  return (
    <MyTeams />
  );
}

export default ManageTeam;
