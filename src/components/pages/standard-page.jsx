import React from 'react';
import { makeStyles } from '@material-ui/core/styles';

import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles(theme => ({
  root: {
    padding: theme.spacing(3, 2)
  },
}));

function StandardPage(props) {
  const classes = useStyles();

  return (
    <Container>
      <Paper align="center" className={ classes.root }>
      { props.children }
      </Paper>
    </Container>
  );
}

export default StandardPage;
