import Request from "config-request";

export async function getTopPlayers() {
  return new Promise((resolve, reject) => {
    Request.get("/top", {}, function (err, data) {
      if (err) {
        return reject(err);
      }
      resolve(data ? data : null);
    });
  });
}
