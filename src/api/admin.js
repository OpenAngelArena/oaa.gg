import Request from 'config-request';
import storage from 'any-storage';

export async function impersonate(steamid) {
  return new Promise((resolve, reject) => {
    Request.get('/admin/impersonate', {
      query: {
        steamid
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
