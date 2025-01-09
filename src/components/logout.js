import storage from 'any-storage';
import { useHistory } from "react-router-dom";

import { useUserState } from './auth';

function Logout() {
  const [userState, userActions] = useUserState();
  const history = useHistory();

  sessionStorage.impersonate = false;
  storage.remove('authentication', () => {
    userActions.login();
    history.push('/login');
  });

  return null;
}

export default Logout;
