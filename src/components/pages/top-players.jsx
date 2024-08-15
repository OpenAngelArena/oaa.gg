import React, { useEffect, useState } from "react";
import { getTopPlayers } from "../../api/top";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Link from "@material-ui/core/Link";
import Typography from "@material-ui/core/Typography";

import { useUserState } from "../auth";
import StandardPage from "./standard-page";

export default function TopPlayers() {
  const [topPlayerData, setTopPlayerData] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const data = await getTopPlayers();
      setTopPlayerData(data);
    }
    fetchData();
  }, []);

  const [{ user }] = useUserState();

  return (
    <StandardPage>
      <Typography variant="h2" gutterBottom>
        {`Top Players`}
      </Typography>
      <List>
        <ListItem>
          <Grid container>
            <Grid item xs={2} md={1}>
              <Typography variant="h6">Rank</Typography>
            </Grid>
            <Grid item xs={8} md={4}>
              <Typography variant="h5">Player Name</Typography>
            </Grid>
            <Grid item xs={2} md={7}>
              <Typography variant="h6">MMR</Typography>
            </Grid>
          </Grid>
        </ListItem>
        {topPlayerData.map((player, i) => (
          <ListItem key={player.steamid}>
            <Grid container>
              <Grid item xs={2} md={1}>
                <Typography variant="h6">{i + 1}</Typography>
              </Grid>
              <Grid item xs={8} md={4}>
                {user.steamid === player.steamid && (
                  <Typography variant="h5">
                    <strong>
                      <i>{player.name}</i>
                    </strong>
                  </Typography>
                )}
                {user.steamid !== player.steamid && (
                  <Typography variant="h5"><Link href={`/matches/${player.steamid}`}>{player.name}</Link></Typography>
                )}
              </Grid>
              <Grid item xs={2} md={7}>
                <Typography variant="h6">{player.mmr.toFixed(2)}</Typography>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </StandardPage>
  );
}
