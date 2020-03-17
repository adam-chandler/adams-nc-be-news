const client = require("../db/index");

exports.selectTopics = () => {
  return client("topics").select("*");
};
