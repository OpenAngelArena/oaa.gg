import React from "react";

import UserInfo from '../user-info';
import ActiveMatches from '../active-matches';
import StandardPage from './standard-page';

function Overview() {
  return (
    <StandardPage>
      <UserInfo />
      <br />
      <br />
      <ActiveMatches />
    </StandardPage>
  );
}

export default Overview;
