import React, { useState, useEffect } from "react";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";

import { useUserState } from "./auth";
import { getActiveMatches } from "../api/match";
import HeroIcon from "./hero-icon";

export default function ActiveMatches() {
  const [activeMatches, setActiveMatches] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const data = await getActiveMatches();
      setActiveMatches(data);
    }
    fetchData();
  }, []);

  const [{ user }] = useUserState();

  console.log(activeMatches);

  /*
  example result:
[
    {
        "matchId": "ac8a78c429c205206058c9554287e76beac87c1383b8ca598b98e8bcbcb02e07",
        "match": {
            "startTime": "08/15/2422:24:34",
            "players": [
                "489000807"
            ],
            "hostId": "489000807",
            "isNewPlayerGame": false,
            "isRankedGame": false,
            "isCaptainsMode": false,
            "id": "ac8a78c429c205206058c9554287e76beac87c1383b8ca598b98e8bcbcb02e07",
            "teams": {
                "dire": [
                    "489000807"
                ],
                "radiant": []
            },
            "banChoices": {
                "489000807": "npc_dota_hero_wisp"
            },
            "bans": [
                "npc_dota_hero_wisp"
            ],
            "heroPicks": {
                "489000807": {
                    "rerandom": false,
                    "hero": "npc_dota_hero_pudge",
                    "random": false
                }
            },
            "stateId": "e02e0873aa38c3cb7bd224c8a80f3bba4ee1fa0d6e76a2088fe773b370734050"
        },
        "score": {
            "goodScore": 0,
            "extend_counter": 0,
            "badScore": 4,
            "limit": 19
        },
        "time": {
            "day": 0.28766307234764,
            "time": 1221
        }
    },
    {
        "matchId": "20b4a7d273b9a6409820f60bc799425bb279c754533c56df4033821709929f12",
        "match": {
            "startTime": "08/15/2422:16:58",
            "players": [
                "7131038",
                "232219850"
            ],
            "hostId": "7131038",
            "isNewPlayerGame": false,
            "isRankedGame": true,
            "isCaptainsMode": false,
            "id": "20b4a7d273b9a6409820f60bc799425bb279c754533c56df4033821709929f12",
            "teams": {
                "dire": [
                    "232219850"
                ],
                "radiant": [
                    "7131038"
                ]
            },
            "banChoices": {
                "7131038": "npc_dota_hero_witch_doctor",
                "232219850": "npc_dota_hero_terrorblade"
            },
            "bans": [
                "npc_dota_hero_witch_doctor"
            ],
            "heroPicks": {
                "7131038": {
                    "rerandom": false,
                    "hero": "npc_dota_hero_vengefulspirit",
                    "random": false
                },
                "232219850": {
                    "rerandom": false,
                    "hero": "npc_dota_hero_venomancer",
                    "random": false
                }
            },
            "stateId": "0edbb58064a1b8424e07f4da74369035a4a21afb880e764c1a635aa62407f63b"
        },
        "score": {
            "badScore": 20,
            "limit": 24,
            "goodScore": 1,
            "extend_counter": 1
        },
        "time": {
            "time": 1683,
            "day": 0.05767910182476
        }
    }
]
*/

  function toReadableTimeLength(time) {
    const gameLength = [];
    if (time > 3600) {
      gameLength.push(`${Math.floor(time / 3600)}hr`);
    }
    if (time > 60) {
      gameLength.push(`${Math.floor(time / 60) % 60}m`);
    }
    if (time) {
      gameLength.push(`${time % (60)}s`);
    }

    return gameLength.join(' ');
  }

  return (
    <Paper>
      <Typography variant="h3" gutterBottom>
        {`Active Matches`}
      </Typography>
      <List>
        {activeMatches
          .sort((matchA, matchB) => matchB.time.time - matchA.time.time)
          .map((match) => (
          <ListItem key={match.matchId}>
            <Grid container>
              <Grid item xs={3} lg={1}>
                <Typography variant="body1">{toReadableTimeLength(match.time.time)}</Typography>
              </Grid>
              <Grid item xs={3} lg={1}>
                <Typography variant="body1">{match.score.goodScore} - {match.score.badScore}
                <br />
                Limit: {match.score.limit}</Typography>
              </Grid>
              <Grid item xs={6} lg={8}>
                <div style={{ display: 'flex', wordWrap: 'no-wrap', flexGrow: 1, justifyContent: 'center' }}>
                  <div style={{ textAlign: 'center' }}>
                    {match.match.teams.radiant.map((steamid) => (
                      <HeroIcon key={steamid} height={24} hero={match.match.heroPicks[steamid].hero} />
                    ))}
                  </div>
                  <div style={{ minWidth: '30px', textAlign: 'center' }}>
                    {match.match.players.length > 1 && " vs "}
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    {match.match.teams.dire.map((steamid) => (
                      <HeroIcon key={steamid} height={24} hero={match.match.heroPicks[steamid].hero} />
                    ))}
                  </div>
                </div>
              </Grid>
              <Grid item xs={12}>
                <Divider />
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    </Paper>
  );
}
