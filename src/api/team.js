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
      resolve(data ? data.token : null);
    });
  });
}

export async function createInvite() {
  return new Promise((resolve, reject) => {
    Request.post('/team/createInvite', {
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data ? data.token : null);
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

export async function listTeams(steamid) {
  return new Promise((resolve, reject) => {
    Request.get('/team/list', {
      query: {
        steamid
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data.data);
    });
  });
}

export async function acceptInvite(steamid) {
  return new Promise((resolve, reject) => {
    Request.post('/team/acceptInvite', {
      body: {
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

export async function rejectInvite(steamid) {
  return new Promise((resolve, reject) => {
    Request.post('/team/rejectInvite', {
      body: {
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


export async function removePlayer(steamid) {
  return new Promise((resolve, reject) => {
    Request.post('/team/removePlayer', {
      body: {
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

export async function leaveTeam(teamId) {
  return new Promise((resolve, reject) => {
    Request.post('/team/leaveTeam', {
      body: {
        teamId
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });
}

export async function setTeamName(name) {
  return new Promise((resolve, reject) => {
    Request.post('/team/updateTeam', {
      body: {
        name
      }
    }, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data);
    });
  });

}
