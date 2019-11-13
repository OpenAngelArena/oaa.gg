import React from 'react';
import { useParams } from "react-router-dom";
import NoTeam from './no-team';
import CreateTeam from './create';
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
    <StandardPage>
      This is the manage team ui!
    </StandardPage>
  );
}

export default ManageTeam;
