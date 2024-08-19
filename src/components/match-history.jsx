import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";

import Match from './match';
import { useUserState } from "./auth";
import { getUser } from "../api/user";

export default function MatchHistory({ userProfile }) {
  if (!userProfile) {
    return null;
  }

  // grab the 100 at the end of the array, they're the most recent
  const recentMatches = userProfile.matches.length > 100 ? userProfile.matches.slice(userProfile.matches.length - 100) : userProfile.matches

  return (
    <List>
      {recentMatches.reverse().map((matchId) => (
        <ListItem key={matchId}>
          <Match matchId={matchId} userId={userProfile.steamid} />
        </ListItem>
      ))}
    </List>
  );
}
