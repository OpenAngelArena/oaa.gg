import React from "react";
import globalHook from 'use-global-hook';
import { classNames } from "react-extras";
import { useHistory } from "react-router-dom";

import { makeStyles, useTheme } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Divider from '@material-ui/core/Divider';
import Drawer from '@material-ui/core/Drawer';
import IconButton from '@material-ui/core/IconButton';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import GroupIcon from '@material-ui/icons/Group';
// import InboxIcon from '@material-ui/icons/Inbox';
// import MailIcon from '@material-ui/icons/Mail';

import { useUserState } from './auth';

const useStyles = makeStyles(theme => ({
  drawer: {
    flexShrink: 0,
    whiteSpace: 'nowrap',
  },
  drawerOpen: {
    width: drawerWidth => drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    ...theme.mixins.toolbar,
  },
}));

const initialState = {
  open: true,
  drawerWidth: 240
};

const actions = {
  toggleDrawer: (store) => {
    store.setState({
      open: !store.state.open
    });
  },
  openDrawer: (store) => {
    store.setState({
      open: true
    });
  },
  closeDrawer: (store) => {
    store.setState({
      open: false
    });
  },
};

export const useDrawerState = globalHook(React, initialState, actions);

export default function AppDrawer(props) {
  const [drawerState, drawerActions] = useDrawerState();
  const [userState] = useUserState();
  const classes = useStyles(drawerState.drawerWidth);
  const theme = useTheme();
  const history = useHistory();

  const { open } = drawerState;

  function handleMenuEntry(entry) {
    history.push(entry.path);
  }

  const menuItems = [{
    icon: GroupIcon,
    text: 'Manage Team',
    path: '/team'
  },
  'divider',
  {
    icon: ExitToAppIcon,
    text: 'Logout',
    path: '/logout'
  }];

  return (
    <Drawer
        variant="permanent"
        className={classNames(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: classNames({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
        open={open}
      >
        <div className={ classes.toolbar }>
          <IconButton onClick={ drawerActions.closeDrawer }>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
            <ListItem button onClick={() => handleMenuEntry({ path: '/' })}>
              <ListItemIcon>
                <Avatar
                  alt={ userState.user.profile.name }
                  src={ userState.user.profile.avatar }
                  />
              </ListItemIcon>
              <ListItemText
                primary={ userState.user.profile.name }
                secondary={ `MMR: ${userState.user.mmr}` } />
            </ListItem>
          {menuItems.map((entry, index) => {
            if (entry === 'divider') {
              return <Divider key={'divider' + index} />;
            }
            return (
              <ListItem button key={entry.text} onClick={() => handleMenuEntry(entry)}>
                <ListItemIcon><entry.icon /></ListItemIcon>
                <ListItemText primary={entry.text} />
              </ListItem>
            );
          })}
        </List>
    </Drawer>
  );
}
