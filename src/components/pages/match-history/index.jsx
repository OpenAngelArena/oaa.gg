import React, { useEffect, useState } from "react";

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
  const [userProfile, setUserProfile] = useState(null);
  const [{ user }] = useUserState();

  useEffect(() => {
    async function fetchData() {
      const userData = getUser(user.steamid);

      setUserProfile(await userData);
    }
    fetchData();
  }, []);


  console.log(user, userProfile);

  if (!userProfile) {
    return <StandardPage />;
  }

  // grab the 100 at the end of the array, they're the most recent
  const recentMatches = userProfile.matches.length > 100 ? userProfile.matches.slice(userProfile.matches.length - 100) : userProfile.matches

  return (
    <StandardPage>
      <Typography variant="h2" gutterBottom>
        {`Match History`}
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
