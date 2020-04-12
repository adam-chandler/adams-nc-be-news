const {
  selectArticle,
  updateArticleVotes,
  insertComment,
  selectComments,
  selectAllArticles,
} = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  selectArticle(req.params.article_id)
    .then((article) => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  const keys = Object.keys(req.body);
  if (keys.length !== 1 || keys[0] !== "inc_votes") {
    return next({ status: 400, msg: "Bad request" });
  }

  const article_id = req.params.article_id;
  const newVotes = req.body.inc_votes;

  updateArticleVotes(article_id, newVotes)
    .then(() => selectArticle(article_id))
    .then((article) => res.status(200).send({ article }))
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  if (order) {
    if (order !== "asc" && order !== "desc") {
      return next({ status: 400, msg: "order_by takes values asc or desc" });
    }
  }
  selectAllArticles(sort_by, order, author, topic)
    .then((articles) => {
      res.status(200).send({ articles });
    })
    .catch(next);
};
