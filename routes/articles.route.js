const articlesRouter = require("express").Router();
const {
  getArticle,
  patchArticleVotes,
  getArticles,
} = require("../contollers/articles.controller");
const {
  postComment,
  getComments,
} = require("../contollers/comments.controller");
const { send405Error } = require("../errors/errors");

articlesRouter
  .route("/:article_id")
  .get(getArticle)
  .patch(patchArticleVotes)
  .all(send405Error);

articlesRouter
  .route("/:article_id/comments")
  .post(postComment)
  .get(getComments)
  .all(send405Error);

articlesRouter.route("/").get(getArticles).all(send405Error);

module.exports = articlesRouter;
