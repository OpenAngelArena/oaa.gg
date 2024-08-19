import React from "react";
import { Switch, Route } from "react-router-dom";

import FourOhFour from "./404";
import Admin from "./pages/admin";
import Overview from "./pages/overview";
import ManageTeam from "./pages/manage-team";
import TopPlayers from "./pages/top-players";
import MatchHistory from "./pages/match-history";
import UserProfile from './pages/user-profile';

export default function Routes() {
  return (
    <Switch>
      <Route exact path="/">
        <Overview />
      </Route>
      <Route path="/team/:action/*">
        <ManageTeam />
      </Route>
      <Route path="/top">
        <TopPlayers />
      </Route>
      <Route path="/matches/:userId">
        <MatchHistory />
      </Route>
      <Route path="/user/:userId">
        <UserProfile />
      </Route>
      <Route path="/matches">
        <MatchHistory />
      </Route>
      <Route path="/team/:action">
        <ManageTeam />
      </Route>
      <Route path="/team">
        <ManageTeam />
      </Route>
      <Route path="/admin">
        <Admin />
      </Route>
      <Route>
        <FourOhFour />
      </Route>
    </Switch>
  );
}
