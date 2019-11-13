import Request from 'config-request';
import storage from 'any-storage';

export function refreshAuthToken(useToken) {
  Request.get('/auth/token', function(err, data) {
    if (data && data.token) {
      storage.set('authentication', data.token, (err, token) => useToken(token));
    } else {
      console.log('Tried to reauth but instead of this shit', err, data);
    }
  });
}
