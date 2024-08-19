import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import { useTheme, ThemeProvider } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import theme from './theme';
import { Analytics } from './google-analytics';
import AppLayout from './components/layout';
import Auth from './components/auth';
import Login from './components/login';
import Logout from './components/logout';
import MatchHistory from './components/pages/match-history';
import UserProfile from './components/pages/user-profile';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router>
        <Analytics />

        <Switch>
          <Route exact path="/auth/:token">
            <Auth />
          </Route>
          <Route exact path="/impersonate/:token">
            <Auth impersonate />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/logout">
            <Logout />
          </Route>
          <Route path="/public/matches/:userId">
            <MatchHistory />
          </Route>
          <Route path="/public/user/:userId">
            <UserProfile />
          </Route>
          <Route path="/">
            <AppLayout />
          </Route>
        </Switch>
      </Router>
    </ThemeProvider>
  );
}

export default App;
