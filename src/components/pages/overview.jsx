import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import { useUserState } from '../auth';
import StandardPage from './standard-page';

const useStyles = makeStyles(theme => ({
  statBox: {
    padding: theme.spacing(1, 0, 3, 0)
  }
}));

function Overview() {
  const [userState] = useUserState();
  const classes = useStyles();

  const {
    mmr,
    profile,
    matchesFinished,
    matchesStarted,
    bestRanking,
    bottlepassLevel,
    averageMonthlyDays,
    seasonPlacings,
    daysPlayedThisMonth
  } = userState.user;

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
    <StandardPage>
      <Typography variant="h2" gutterBottom>
        { `Hello, ${profile.name}`}
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
      </Grid>
    </StandardPage>
  );
}

export default Overview;
