import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Match from './match';

import StandardPage from "../standard-page";

import { useUserState } from "../../auth";
import { getUser } from "../../../api/user";

export default function MatchHistory() {
  const { userId } = useParams();

  const [userProfile, setUserProfile] = useState(null);
  const [{ user }] = useUserState();

  console.log({ userId });

  useEffect(() => {
    async function fetchData() {
      const userData = getUser(userId || user.steamid);

      setUserProfile(await userData);
    }
    fetchData();
  }, []);

  if (!userProfile) {
    return <StandardPage />;
  }

  // grab the 100 at the end of the array, they're the most recent
  const recentMatches = userProfile.matches.length > 100 ? userProfile.matches.slice(userProfile.matches.length - 100) : userProfile.matches

  return (
    <StandardPage>
      <Typography variant="h2">
        Match History
      </Typography>
      <Typography variant="subtitle1" gutterBottom>
        {userProfile.profile.name}
      </Typography>
      <List>
      {recentMatches.reverse().map((matchId) => (<ListItem key={matchId}>
        <Match matchId={matchId} />
      </ListItem>)
      )}
      </List>
    </StandardPage>
  );
}
