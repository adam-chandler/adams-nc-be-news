const topicRouter = require("express").Router();
const { getTopics } = require("../contollers/topics.controller");
const { send405Error } = require("../errors/errors");

topicRouter
  .route("/")
  .get(getTopics)
  .all(send405Error);

module.exports = topicRouter;
