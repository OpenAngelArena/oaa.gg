import Request from "config-request";

export async function getMatch(matchId) {
  return new Promise((resolve, reject) => {
    Request.get(`/matches/${matchId}`, {}, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data ? data : null);
    });
  });
}
