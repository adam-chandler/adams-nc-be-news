const apiRouter = require("express").Router();
const topicRouter = require("./topics.route");
const usersRouter = require("./users.route");
const articlesRouter = require("./articles.route");

apiRouter.use("/topics", topicRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/articles", articlesRouter);

module.exports = apiRouter;
