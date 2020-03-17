const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticleVotes
} = require("../contollers/articles.controller");
const { send405Error } = require("../errors/errors");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .all(send405Error);

module.exports = articlesRouter;
