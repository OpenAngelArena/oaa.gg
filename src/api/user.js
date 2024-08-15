import Request from "config-request";

export async function getUser(userId) {
  return new Promise((resolve, reject) => {
    Request.get(`/users/${userId}`, {}, function (err, data) {
      if (err) {
        reject(err);
      }
      resolve(data ? data : null);
    });
  });
}
