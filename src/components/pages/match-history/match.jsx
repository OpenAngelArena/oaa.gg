import React, { useEffect, useState } from "react";

import Grid from "@material-ui/core/Grid";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Paper from "@material-ui/core/Paper";
import Typography from "@material-ui/core/Typography";
import Divider from '@material-ui/core/Divider';

import EmojiEventsIcon from "@material-ui/icons/EmojiEvents";
import CloudDownloadIcon from "@material-ui/icons/CloudDownload";

import { timeAgo } from "short-time-ago";

import { useUserState } from "../../auth";
import { getMatch } from "../../../api/match";
import { CloudDownload } from "@material-ui/icons";

const HeroNameMap = {
  electrician: 'chatterjee'
};

const CustomHeroImage = {
  electrician: "https://raw.githubusercontent.com/OpenAngelArena/oaa/master/content/panorama/images/heroes/npc_dota_hero_electrician.png",
  sohei: "https://raw.githubusercontent.com/OpenAngelArena/oaa/master/content/panorama/images/heroes/npc_dota_hero_sohei.png",
};

function imgUrlForHero(hero) {
  if (CustomHeroImage[hero]) {
    return CustomHeroImage[hero];
  }
  return `https://cdn.akamai.steamstatic.com/apps/dota2/images/dota_react/heroes/${hero}.png`
}

function heroName(hero) {
  if (HeroNameMap[hero]) {
    hero = HeroNameMap[hero];
  }

  return hero
    .replace(/_/g, ' ')
    .split(' ')
    .map((part) => {
      if (!part || !part.length) {
        return part;
      }
      return part[0].toUpperCase() + part.substr(1).toLowerCase();
    })
    .join(' ');
}

export default function Match({ matchId }) {
  const [matchData, setMatchData] = useState(null);
  const [{ user }] = useUserState();

  useEffect(() => {
    async function fetchData() {
      const userData = getMatch(matchId);

      setMatchData(await userData);
    }
    fetchData();
  }, []);

  if (!matchData) {
    return (
      <Grid container>
        <Grid item xs={1}>
          <CloudDownloadIcon />
        </Grid>
        <Grid item xs={10}>
          Loading data for match {matchId.substr(0, 8)}...
        </Grid>
      </Grid>
    );
  }

  console.log(matchData);

  const startDate = matchData.startTime.substr(0, 8);
  const startTime = matchData.startTime.substr(8);
  console.log(startDate, startTime);

  const wasOnDire = matchData.teams.dire.indexOf(user.steamid) >= 0;
  const teamName = wasOnDire ? "dire" : "radiant";
  const didWin = matchData.outcome === teamName;

  const myHeroPick = matchData.heroPicks[user.steamid];
  const myHeroName = myHeroPick ? myHeroPick.hero.substr(14) : null;
  console.log(myHeroPick);
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
    <Grid container>
      <Grid item xs={2} sm={2} md={1}>
        {startDate}
      </Grid>
      <Grid item xs={3} sm={2} md={1}>
        <EmojiEventsIcon style={{color: didWin ? "#00ff00" : "#ff0000"}} />
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
            <img height={24} src={imgUrlForHero(myHeroName)} alt={heroName(myHeroName)}/>
            {randomText} {heroName(myHeroName)}
          </>
        )}
      </Grid>
      <Grid item xs={12} md={7}>
        {Object.keys(matchData.heroPicks).length > 0 && (
          <div style={{ display: 'flex', wordWrap: 'no-wrap', }}>
            <div style={{ textAlign: 'center' }}>
            {matchData.teams.radiant.map((steamid) => {
              const pick = matchData.heroPicks[steamid];
              if (pick) {
                return <img key={steamid} height={24} src={imgUrlForHero(pick.hero.substr(14))} alt={heroName(pick.hero.substr(14))}/>
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
                return <img key={steamid} style={{height: '24px'}} src={imgUrlForHero(pick.hero.substr(14))} alt={heroName(pick.hero.substr(14))}/>
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
