import React, { useEffect, useState } from "react";
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import ProgressBar from '@material-ui/core/LinearProgress';

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
  const userIdFromState = userState.user ? userState.user.steamid : null;
  const { userId = userIdFromState } = props;
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

  const heroBans = Object.keys(userProfile ? userProfile.heroBans : {})
    .sort((heroA, heroB) => userProfile.heroBans[heroB] - userProfile.heroBans[heroA])
    .slice(0, 10);
  const totalHeroBans = heroBans.reduce((memo, val) => memo + userProfile.heroBans[val], 0);

  const heroPicks = Object.keys(userProfile ? userProfile.heroPicks : {})
    .sort((heroA, heroB) => userProfile.heroPicks[heroB] - userProfile.heroPicks[heroA])
    .slice(0, 10);
  const totalHeroPicks = heroPicks.reduce((memo, val) => memo + userProfile.heroPicks[val], 0);

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
            {heroPicks.map((hero) => (
                <Grid container spacing={2} key={hero}>
                  <Grid item xs={12}>
                    <ProgressBar color='primary' variant='determinate' value={userProfile.heroPicks[hero] / totalHeroPicks * 100} />
                  </Grid>
                  <Grid item xs={4}>
                    <HeroIcon height={48} hero={hero} />
                  </Grid>
                  <Grid item xs={8} style={{ textAlign: 'left' }}>
                    <Typography variant='h4'>{heroName(hero)}</Typography>
                    {userProfile.heroPicks[hero] > 1 && <Typography variant='h5'>x{userProfile.heroPicks[hero]}</Typography>}
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
            {heroBans.map((hero) => (
                <Grid container spacing={2} key={hero}>
                  <Grid item xs={12}>
                    <ProgressBar color='secondary' variant='determinate' value={userProfile.heroBans[hero] / totalHeroBans * 100} />
                  </Grid>
                  <Grid item xs={4}>
                    <HeroIcon height={48} hero={hero} />
                  </Grid>
                  <Grid item xs={8} style={{ textAlign: 'left' }}>
                    <Typography variant='h4'>{heroName(hero)}</Typography>
                    {userProfile.heroBans[hero] > 1 && <Typography variant='h5'>x{userProfile.heroBans[hero]}</Typography>}
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
