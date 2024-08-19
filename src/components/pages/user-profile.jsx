import React, { useState, useEffect } from "react";

import { useParams } from "react-router-dom";

import Typography from "@material-ui/core/Typography";

import StandardPage from './standard-page';
import { useUserState } from "../auth";
import UserInfo from '../user-info';
import MatchHistory from '../match-history';
import { getUser } from "../../api/user";

function Overview() {
  const [{ user }] = useUserState();
  const { userId = user.steamid } = useParams();
  const [userProfile, setUserProfile] = useState(null);

  console.log({ userId });

  useEffect(() => {
    async function fetchData() {
      const userData = getUser(userId);

      setUserProfile(await userData);
    }
    fetchData();
  }, [userId]);

  if (!userProfile) {
    return <StandardPage />;
  }

  return (
    <StandardPage>
      <UserInfo userId={userId} userProfile={userProfile} />
      <br />
      <br />
      <Typography variant="h2">
        Match History
      </Typography>
      <MatchHistory userProfile={userProfile} />
    </StandardPage>
  );
}

export default Overview;
