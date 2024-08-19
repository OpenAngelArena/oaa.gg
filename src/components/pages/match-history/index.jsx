import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";


import StandardPage from "../standard-page";

import MatchHistory from '../../match-history';
import { useUserState } from "../../auth";
import { getUser } from "../../../api/user";

export default function MatchHistoryPage() {
  const { userId } = useParams();

  const [userProfile, setUserProfile] = useState(null);
  const [{ user }] = useUserState();

  const userIdToFetch = userId || user.steamid;

  useEffect(() => {
    async function fetchData() {
      const userData = getUser(userIdToFetch);

      setUserProfile(await userData);
    }
    fetchData();
  }, [userIdToFetch]);

  if (!userProfile) {
    return <StandardPage />;
  }

  return (
    <StandardPage>
      <Typography variant="h2">
        Match History
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {userProfile.profile.name}
      </Typography>
      <MatchHistory userProfile={userProfile} />
    </StandardPage>
  );
}
