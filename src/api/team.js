import Request from 'config-request';

export async function createTeam(teamName) {
  return new Promise((resolve, reject) => {
    Request.post('/team/create', {
      body: {
        name: teamName
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
