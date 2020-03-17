const client = require("../db/index");

exports.selectUserByUsername = username => {
  return client("users")
    .select("*")
    .where("username", username)
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ status: 404, msg: "User not found" });
      } else {
        return res[0];
      }
    });
};
