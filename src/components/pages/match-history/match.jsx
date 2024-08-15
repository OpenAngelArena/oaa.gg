import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider';

import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";
import CasinoIcon from "@material-ui/icons/Casino";
import ShuffleIcon from "@material-ui/icons/Shuffle";
import HelpIcon from "@material-ui/icons/Help";

import { timeAgo } from "short-time-ago";

import { useInView } from 'react-intersection-observer';

import { useUserState } from "../../auth";
import HeroIcon, {heroName} from '../../hero-icon';
import { getMatch } from "../../../api/match";
import { CloudDownload } from "@material-ui/icons";

export default function Match({ matchId }) {
  const { userId } = useParams();
  const { ref, inView, entry } = useInView({
    triggerOnce: true,
    delay: 500,
    threshold: 1
  });
  const [shouldLoad, setShouldLoad] = useState(inView);
  const [matchData, setMatchData] = useState(null);
  const [{ user }] = useUserState();

  useEffect(() => {
    async function fetchData() {
      const userData = getMatch(matchId);

      setMatchData(await userData);
    }
    if (shouldLoad) {
      fetchData();
    }
  }, [shouldLoad]);

  useEffect(() => {
    if (!shouldLoad && inView) {
      setShouldLoad(true);
    }
  }, [inView]);

  if (!matchData) {
    return (
      <Grid container ref={ref}>
        <Grid item xs={1}>
          <CloudDownloadIcon />
        </Grid>
        <Grid item xs={10}>
          Loading data for match {matchId.substr(0, 8)}...
        </Grid>
      </Grid>
    );
  }

  // console.log(matchData);

  const startDate = matchData.startTime.substr(0, 8);
  const startTime = matchData.startTime.substr(8);

  const steamid = userId || user.steamid;

  const wasOnDire = matchData.teams.dire.indexOf(steamid) >= 0;
  const teamName = wasOnDire ? "dire" : "radiant";
  const didWin = matchData.outcome === teamName;

  const myHeroPick = matchData.heroPicks[steamid];
  const myHeroName = myHeroPick ? myHeroPick.hero.substr(14) : null;
  // https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/abaddon.png

  const randomText = myHeroPick && (myHeroPick.rerandom ? "Rerandomed" : (myHeroPick.random ? "Randomed" : ""));

  const gameLength = [];

  if (matchData.gameLength > 3600) {
    gameLength.push(`${Math.floor(matchData.gameLength / 3600)}hr`);
  }
  if (matchData.gameLength > 60) {
    gameLength.push(`${Math.floor(matchData.gameLength / 60) % 60}m`);
  }
  if (matchData.gameLength) {
    gameLength.push(`${matchData.gameLength % (60)}s`);
  }

  return (
    <Grid container ref={ref}>
      <Grid item xs={2} sm={2} md={1}>
        {(new Date(startDate)).toLocaleDateString()}
      </Grid>
      <Grid item xs={3} sm={2} md={1}>
        {matchData.outcome && <EmojiEventsIcon style={{color: didWin ? "#00ff00" : "#ff0000"}} />}
        {!matchData.outcome && <HelpIcon />}
        {" "}
        <img height={32} src={`/${teamName}.png`} alt={heroName(teamName)}/>
      </Grid>
      <Grid item xs={2} sm={2} md={1}>
        {!!gameLength.length && gameLength.join(' ')}
        {!gameLength.length && '?'}
      </Grid>
      <Grid item xs={5} sm={6} md={2}>
        {myHeroPick && (
          <>
            <HeroIcon height={24} hero={myHeroName} />
            {myHeroPick.random && <CasinoIcon />}
            {myHeroPick.rerandom && <ShuffleIcon />}
            {/* heroName(myHeroName) */}
          </>
        )}
      </Grid>
      <Grid item xs={12} md={7} style={{  }}>
        {Object.keys(matchData.heroPicks).length > 0 && (
          <div style={{ display: 'flex', wordWrap: 'no-wrap', flexGrow: 1, justifyContent: 'center' }}>
            <div style={{ textAlign: 'center' }}>
            {matchData.teams.radiant.map((steamid) => {
              const pick = matchData.heroPicks[steamid];
              if (pick) {
                return <HeroIcon key={steamid} height={24} hero={pick.hero} />
              }
              return null;
            })}
            </div>
            <div style={{ minWidth: '30px', textAlign: 'center' }}>
            {" vs "}
            </div>
            <div style={{ textAlign: 'center' }}>
            {matchData.teams.dire.map((steamid) => {
              const pick = matchData.heroPicks[steamid];
              if (pick) {
                return <HeroIcon key={steamid} height={24} hero={pick.hero} />
              }
              return null;
            })}
            </div>
          </div>
        )}
      </Grid>
      <Grid item xs={12}>
        <Divider />
      </Grid>
    </Grid>
  );
}
