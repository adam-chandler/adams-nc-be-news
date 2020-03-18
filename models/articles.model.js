const client = require("../db/index");

exports.selectArticle = article_id => {
  return client("articles")
    .select(
      "articles.author",
      "articles.title",
      "articles.article_id",
      "articles.body",
      "topic",
      "articles.created_at",
      "articles.votes"
    )
    .count("comments.comment_id AS comment_count")
    .join("comments", "comments.article_id", "articles.article_id")
    .groupBy("articles.article_id")
    .where("articles.article_id", article_id)
    .then(res => {
      if (res.length === 0) {
        return Promise.reject({ msg: "Article not found", status: 404 });
      }
      return res[0];
    });
};

exports.updateArticleVotes = (article_id, newVotes) => {
  return client("articles")
    .increment("votes", newVotes)
    .where("articles.article_id", article_id)
    .returning("*")
    .then(res => res[0]);
};

exports.insertComment = (username, body, article_id) => {
  return client("comments")
    .insert({
      author: username,
      article_id,
      body
    })
    .returning("*")
    .then(res => res[0]);
};

exports.selectComments = (article_id, sort_by, order_by) => {
  return Promise.all([
    client("comments")
      .select("*")
      .where("article_id", article_id)
      .orderBy(sort_by || "created_at", order_by || "asc"),
    client("articles")
      .select("*")
      .where("article_id", article_id)
  ]).then(([comments, article]) => {
    if (article.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "No article exists with this id."
      });
    }
    if (comments.length === 0) {
      return Promise.reject({
        status: 200,
        msg: "This article currently has no comments."
      });
    }
    comments.forEach(comment => delete comment.article_id);
    return comments;
  });
};

exports.selectArticles = () => {};
