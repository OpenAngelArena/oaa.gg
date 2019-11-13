import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';

import CircularProgress from '@material-ui/core/CircularProgress';

import StandardPage from '../standard-page';

export default function Loading () {
  return (
    <StandardPage>
      <br />
      <br />
      <br />
      <CircularProgress size={128} />
      <br />
      <br />
      <br />
    </StandardPage>
  );
}
