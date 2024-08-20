import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { getUser } from "../api/user";
import { useUserState } from './auth';
import HeroIcon, { heroName } from './hero-icon';
import ActiveMatches from './active-matches';

const useStyles = makeStyles(theme => ({
  statBox: {
    padding: theme.spacing(1, 0, 3, 0)
  }
}));

function UserInfo(props = {}) {
  const [userState] = useUserState();
  const { userId = userState.steamid } = props;
  const classes = useStyles();
  const [userProfile, setUserProfile] = useState(props.userProfile || null);
  const { user } = userState;

  const greeting = (user && user.steamid === userId) ? 'Hello, ' : '';

  useEffect(() => {
    async function fetchData() {
      const userData = getUser(userId);

      setUserProfile(await userData);
    }
    if (!userProfile || userProfile.steamid !== userId) {
      fetchData();
    }
  }, [userId]);

  if (!userProfile) {
    return null;
  }

  const {
    unrankedMMR,
    profile,
    matchesFinished,
    matchesStarted,
    bestRanking,
    bottlepassLevel,
    averageMonthlyDays,
    seasonPlacings,
    daysPlayedThisMonth
  } = userProfile;

  const mmr = Math.round(unrankedMMR * 100) / 100;

  const statBoxes = [{
    text: 'MMR',
    value: mmr
  }, {
    text: 'Games Started',
    value: matchesStarted
  }, {
    text: 'Games Finished',
    value: matchesFinished
  }, {
    text: 'Bottlepass Level',
    value: bottlepassLevel
  }, {
    text: 'Best Ranking Achieved',
    value: bestRanking
  }, {
    text: 'Average Monthly Days Played',
    value: (Math.round(10 * averageMonthlyDays) / 10)
  }, {
    text: 'Days Played This Month',
    value: daysPlayedThisMonth,
  }, {
    text: 'Top 100 Placings',
    value: seasonPlacings
  }];

  return (
    <>
      <Typography variant="h2" gutterBottom>
        {greeting}{profile.name}
      </Typography>
      <Grid container spacing={2}>
        {statBoxes.map((entry) => (
          <Grid item xs={12} sm={6} md={3} key={entry.text}>
            <Paper className={ classes.statBox }>
              <Typography variant="subtitle1">
                { entry.text }
              </Typography>
              <Typography variant="h3">
                { entry.value }
              </Typography>
            </Paper>
          </Grid>
        ))}

        <Grid item xs={12} md={6}>
          <Paper className={ classes.statBox }>
            <Typography variant="h5">
              Most picked heroes
            </Typography>
            {userProfile && Object.keys(userProfile.heroPicks)
              .sort((heroA, heroB) => userProfile.heroPicks[heroB] - userProfile.heroPicks[heroA])
              .slice(0, 10)
              .map((hero) => (
                <Grid container spacing={2} key={hero}>
                  <Grid item xs={4}>
                    <HeroIcon height={48} hero={hero} />
                  </Grid>
                  <Grid item xs={8} style={{ textAlign: 'left' }}>
                    {heroName(hero)}
                  </Grid>
                </Grid>
              ))
            }
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper className={ classes.statBox }>
            <Typography variant="h5">
              Most banned heroes
            </Typography>
            {userProfile && Object.keys(userProfile.heroBans)
              .sort((heroA, heroB) => userProfile.heroBans[heroB] - userProfile.heroBans[heroA])
              .slice(0, 10)
              .map((hero) => (
                <Grid container spacing={2} key={hero}>
                  <Grid item xs={4}>
                    <HeroIcon height={48} hero={hero} />
                  </Grid>
                  <Grid item xs={8} style={{ textAlign: 'left' }}>
                    {heroName(hero)}
                  </Grid>
                </Grid>
              ))
            }
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

export default UserInfo;
