const {
  selectArticle,
  updateArticleVotes,
  insertComment,
  selectComments,
  selectArticles
} = require("../models/articles.model");

exports.getArticle = (req, res, next) => {
  selectArticle(req.params.article_id)
    .then(article => {
      res.status(200).send({ article });
    })
    .catch(next);
};

exports.patchArticleVotes = (req, res, next) => {
  if (Object.keys(req.body).length !== 1) {
    next({ status: 400, msg: "Bad request" });
  }

  const article_id = req.params.article_id;
  const newVotes = req.body.inc_votes;

  updateArticleVotes(article_id, newVotes)
    .then(() => selectArticle(article_id))
    .then(article => res.status(200).send({ article }))
    .catch(next);
};

exports.postComment = (req, res, next) => {
  if (Object.keys(req.body).length !== 2) {
    next({ status: 400, msg: "Bad request" });
  }

  const { username, body } = req.body;
  const { article_id } = req.params;

  insertComment(username, body, article_id)
    .then(comment => {
      res.status(201).send(comment);
    })
    .catch(next);
};

exports.getComments = (req, res, next) => {
  const { sort_by, order_by } = req.query;
  const article_id = req.params.article_id;

  if (order_by) {
    if (order_by !== "asc" && order_by !== "desc") {
      next({ status: 400, msg: "order_by takes values asc or desc" });
    }
  }
  selectComments(article_id, sort_by, order_by)
    .then(comments => {
      res.status(200).send({ comments });
    })
    .catch(next);
};

exports.getArticles = (req, res, next) => {
  const { sort_by, order, author, topic } = req.query;
  selectArticles(sort_by, order, author, topic).then(articles => {
    res.status(400).send(articles);
  });
};
