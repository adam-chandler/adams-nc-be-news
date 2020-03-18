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
    .leftJoin("comments", "comments.article_id", "articles.article_id")
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

    comments.forEach(comment => delete comment.article_id);
    return comments;
  });
};

exports.selectAllArticles = (sort_by, order, author, topic) => {
  return Promise.all([
    client("articles")
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
      .orderBy(sort_by || "created_at", order || "asc")
      .leftJoin("comments", "comments.article_id", "articles.article_id")
      .groupBy("articles.article_id")
      .modify(query => {
        if (author) {
          query.where("articles.author", author);
        }
      })
      .modify(query => {
        if (topic) {
          query.where("articles.topic", topic);
        }
      }),
    client("users")
      .select("*")
      .where("username", author || "*"),
    client("topics")
      .select("*")
      .where("slug", topic || "*")
  ]).then(([articles, user, outputTopic]) => {
    if (author && user.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Author not found"
      });
    }
    if (topic && outputTopic.length === 0) {
      return Promise.reject({
        status: 404,
        msg: "Topic not found"
      });
    }
    return articles;
  });
};
