import Request from 'config-request';
import storage from 'any-storage';

export function refreshAuthToken(useToken) {
  Request.get('/auth/token', function(err, data) {
    if (data && data.token) {
      useToken(data.token);
    } else {
      console.log('Tried to reauth but instead of this shit', err, data);
    }
  });
}
