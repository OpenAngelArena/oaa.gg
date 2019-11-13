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

export async function getInvite() {
  return new Promise((resolve, reject) => {
    Request.get('/team/invite', {
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.token);
    });
  });
}

export async function checkInvite(token) {
  return new Promise((resolve, reject) => {
    Request.get('/team/checkInvite', {
      query: {
        token
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function joinTeam(token) {
  return new Promise((resolve, reject) => {
    Request.post('/team/join', {
      body: {
        token
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function getTeamData(id) {
  return new Promise((resolve, reject) => {
    Request.get('/team/view', {
      query: {
        id
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}
