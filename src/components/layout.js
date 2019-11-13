import React from "react";
import { Switch, Route } from "react-router-dom";
import { makeStyles } from '@material-ui/core/styles';

import AppBar from "./app-bar";
import Drawer from "./drawer";
import Login from "./login";
import FourOhFour from './404';
import Overview from "./pages/overview";
import ManageTeam from './pages/manage-team';
import { useUserState } from './auth';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

export default function AppLayout(props) {
  const [userState] = useUserState();
  const classes = useStyles();

  if (!userState.user) {
    return <Login />
  }

  return (
    <div className={classes.root}>
      <AppBar />
      <Drawer />
      <main className={classes.content}>
        <div className={classes.toolbar} />
        <Switch>
          <Route exact path="/">
            <Overview />
          </Route>
          <Route path="/team/:action">
            <ManageTeam />
          </Route>
          <Route path="/team">
            <ManageTeam />
          </Route>
          <Route>
            <FourOhFour />
          </Route>
        </Switch>
      </main>
    </div>
  );
}
