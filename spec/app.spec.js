process.env.NODE_ENV = "test";

const chai = require("chai");
const chaiSorted = require("chai-sorted");
const { expect } = chai;
const app = require("../app");
const request = require("supertest");
const client = require("../db/index");

chai.use(chaiSorted);

beforeEach(() => {
  return client.seed.run();
});

after(() => {
  client.destroy().then(() => console.log("done testing"));
});

describe("/api ", () => {
  it("INVALID ROUTES: 404 and meessage route not found", () => {
    return request(app)
      .get("/api/not-a-route")
      .expect(404)
      .then(({ body: { msg } }) => {
        expect(msg).to.equal("Route not found");
      });
  });
  it("GET: 200 - Send endpoints", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then((res) => {
        expect(res.body).to.be.an("object");
      });
  });
  describe("/topics", () => {
    describe("GET", () => {
      it("GET: 200 - Responds an object cotaining an array of topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then((res) => {
            expect(res.body.topics).to.be.an("array");
            expect(res.body.topics[0]).to.be.an("object");
            expect(res.body.topics[0]).to.have.all.keys("description", "slug");
          });
      });
    });
    describe("INVALID METHODS", () => {
      it("INVALID METHODS: 405 and method not allowed", () => {
        const invalidMethods = ["post", "put", "delete"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/topics")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/users/:username", () => {
    describe("GET", () => {
      it("GET: 200 - Returns a user object", () => {
        return request(app)
          .get("/api/users/lurker")
          .expect(200)
          .then((result) => {
            expect(result.body.user).to.have.keys(
              "username",
              "avatar_url",
              "name"
            );
          });
      });
      it("GET: 404 - User not found", () => {
        return request(app)
          .get("/api/users/not-a-user")
          .expect(404)
          .then((result) => {
            expect(result.body.msg).to.equal("User not found");
          });
      });
    });
    describe("INVALID METHODS", () => {
      it("INVALID METHODS: 405 and method not allowed", () => {
        const invalidMethods = ["post", "patch", "delete"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/users/lurker")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
  });
  describe("/articles", () => {
    describe("GET", () => {
      it("Returns all article objects in an array", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body }) => {
            expect(body.articles[0]).to.have.keys(
              "author",
              "title",
              "article_id",
              "body",
              "topic",
              "created_at",
              "votes",
              "comment_count"
            );
            expect(body).to.be.an("object");
            expect(body.articles).to.be.an("array");
            expect(body.articles).to.have.length(12);
          });
      });
      it("GET: 200 - Has a comment count with the number of comments for a given article", () => {
        return request(app)
          .get("/api/articles")
          .expect(200)
          .then(({ body: { articles } }) => {
            expect(articles[0].comment_count).to.equal("13");
          });
      });
      it("GET: 200 - sort_by and order by default to created_at and desc", () => {
        return request(app)
          .get("/api/articles/")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.be.sortedBy("created_at", {
              descending: true,
            });
          });
      });
      it("GET: 200 - sort_by other columns", () => {
        return request(app)
          .get("/api/articles/?sort_by=body")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.be.sortedBy("body", {
              descending: true,
            });
          });
      });
      it("GET: 200 - order ascending", () => {
        return request(app)
          .get("/api/articles/?order=asc")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.be.sortedBy("created_at");
          });
      });
      it("GET: 200 - sort_by and order work simultaneously", () => {
        return request(app)
          .get("/api/articles/?sort_by=body&order=desc")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.be.sortedBy("body", {
              descending: true,
            });
          });
      });
      it("GET: 400 - sort_by is not a column name", () => {
        return request(app)
          .get("/api/articles/?sort_by=not-a-column")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Bad request");
          });
      });
      it("GET: 400 - order is invalid input", () => {
        return request(app)
          .get("/api/articles/?order=invalid-input")
          .expect(400)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("order_by takes values asc or desc");
          });
      });
      it("GET: 200 - Author query that filter by author", () => {
        return request(app)
          .get("/api/articles/?author=icellusedkars")
          .expect(200)
          .then((res) => {
            expect(res.body.articles[0].author).to.equal("icellusedkars");
            expect(res.body.articles[1].author).to.equal("icellusedkars");
            expect(res.body.articles[2].author).to.equal("icellusedkars");
          });
      });
      it("GET: 404 - Author that does not exist", () => {
        return request(app)
          .get("/api/articles/?author=does-not-exist")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Author not found");
          });
      });
      it("GET: 200 - Author that does exist with no articles", () => {
        return request(app)
          .get("/api/articles/?author=lurker")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.eql([]);
          });
      });
      it("GET: 200 - Topic query that filters by topic", () => {
        return request(app)
          .get("/api/articles/?topic=cats")
          .expect(200)
          .then((res) => {
            expect(res.body.articles[0].topic).to.equal("cats");
          });
      });
      it("GET: 404 - Topic that does not exist", () => {
        return request(app)
          .get("/api/articles/?topic=does-not-exist")
          .expect(404)
          .then(({ body: { msg } }) => {
            expect(msg).to.equal("Topic not found");
          });
      });
      it("GET: 200 - Topic that does exist with no articles responds with empty array", () => {
        return request(app)
          .get("/api/articles/?topic=paper")
          .expect(200)
          .then((res) => {
            expect(res.body.articles).to.eql([]);
          });
      });
      it("GET: 200 - Topic and author work simultaneously", () => {
        return request(app)
          .get("/api/articles/?topic=mitch&author=rogersop")
          .expect(200)
          .then((res) => {
            expect(res.body.articles.length).to.eql(2);
            expect(res.body.articles[0].author).to.eql("rogersop");
            expect(res.body.articles[0].topic).to.eql("mitch");
          });
      });
    });
    describe("INVALID METHODS", () => {
      it("INVALID METHODS: 405 and method not allowed", () => {
        const invalidMethods = ["post", "put", "delete"];
        const methodPromises = invalidMethods.map((method) => {
          return request(app)
            [method]("/api/articles")
            .expect(405)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("method not allowed");
            });
        });
        return Promise.all(methodPromises);
      });
    });
    describe("/:article_id", () => {
      describe("GET", () => {
        it("GET: 200 - Responds with an article object", () => {
          return request(app)
            .get("/api/articles/5")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
            });
        });
        it("GET: 200 - Has a comment count with the number of comments for a given article", () => {
          return request(app)
            .get("/api/articles/1")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.comment_count).to.equal("13");
            });
        });
        it("GET: 404 - Valid article ID which does not exist", () => {
          return request(app)
            .get("/api/articles/0")
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Article not found");
            });
        });
        it("GET: 400 - Invalid article ID", () => {
          return request(app)
            .get("/api/articles/not-an-article-id")
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request");
            });
        });
      });
      describe("PATCH", () => {
        it("PATCH: 200 - Responds with article", () => {
          return request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: 1 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(article.votes).to.equal(1);
            });
        });
        it("PATCH: 200 - Works with negative number of votes", () => {
          return request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: -100 })
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article).to.have.all.keys(
                "author",
                "title",
                "article_id",
                "body",
                "topic",
                "created_at",
                "votes",
                "comment_count"
              );
              expect(article.votes).to.equal(-100);
            });
        });
        it("PATCH: 200 - Cumulative", () => {
          return request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: 2 })
            .expect(200)
            .then(({ body: { article } }) => {
              return request(app)
                .patch("/api/articles/6")
                .send({ inc_votes: 3 })
                .expect(200)
                .then(({ body: { article } }) => {
                  expect(article.votes).to.equal(5);
                });
            });
        });
        it("PATCH: 400 - No inc_votes on request body", () => {
          return request(app)
            .patch("/api/articles/6")
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => expect(msg).to.equal("Bad request"));
        });
        it("PATCH: 400 - Invalid input as value of inc_votes", () => {
          return request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: "Invalid-input" })
            .expect(400)
            .then(({ body: { msg } }) => expect(msg).to.equal("Bad request"));
        });
        it("PATCH: 400 - Extra properties on request body", () => {
          return request(app)
            .patch("/api/articles/6")
            .send({ inc_votes: 1, invalidExtraKey: "Invalid extra value" })
            .expect(400)
            .then(({ body: { msg } }) => expect(msg).to.equal("Bad request"));
        });
        it("PATCH: 400 - No inc_votes on request body", () => {
          return request(app)
            .patch("/api/articles/6")
            .send({ Bad: "request" })
            .expect(400)
            .then(({ body: { msg } }) => expect(msg).to.equal("Bad request"));
        });
      });
      describe("INVALID METHODS", () => {
        it("INVALID METHODS: 405 and method not allowed", () => {
          const invalidMethods = ["post", "delete"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/articles/3")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
      describe("/comments", () => {
        describe("POST", () => {
          it("POST: 201 - Respond with a object containing comment", () => {
            return request(app)
              .post("/api/articles/7/comments")
              .send({
                username: "butter_bridge",
                body: "This is a comment and what a comment this is.",
              })
              .expect(201)
              .then((res) => {
                expect(res.body.comment).to.have.keys(
                  "comment_id",
                  "body",
                  "article_id",
                  "author",
                  "votes",
                  "created_at"
                );
                expect(res.body.comment.body).to.equal(
                  "This is a comment and what a comment this is."
                );
                expect(res.body.comment.author).to.equal("butter_bridge");
                expect(res.body.comment.comment_id).to.equal(19);
              });
          });
          it("POST: 404 - Article does not exist", () => {
            return request(app)
              .post("/api/articles/0/comments")
              .send({
                username: "butter_bridge",
                body: "This is a comment and what a comment this is.",
              })
              .expect(404)
              .then((res) => {
                expect(res.body.msg).to.equal("Not found");
              });
          });
          it("POST: 404 - Username not found", () => {
            return request(app)
              .post("/api/articles/3/comments")
              .send({
                username: "not-a-username",
                body: "This is a comment and what a comment this is.",
              })
              .expect(404)
              .then((res) => {
                expect(res.body.msg).to.equal("Not found");
              });
          });
          it("POST: 400 - Input missing username", () => {
            return request(app)
              .post("/api/articles/3/comments")
              .send({
                body: "This is a comment and what a comment this is.",
              })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).to.equal("Bad request");
              });
          });
          it("POST: 400 - Input missing body", () => {
            return request(app)
              .post("/api/articles/3/comments")
              .send({
                username: "butter_bridge",
              })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).to.equal("Bad request");
              });
          });
          it("POST: 400 - Extra properties on body", () => {
            return request(app)
              .post("/api/articles/3/comments")
              .send({
                username: "butter_bridge",
                body: "This is a comment and what a comment this is.",
                Extra: "Properties",
              })
              .expect(400)
              .then((res) => {
                expect(res.body.msg).to.equal("Bad request");
              });
          });
        });
        describe("GET", () => {
          it("GET: 200 - Responds with an array of comments for the given article_id", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).to.be.an("array");
                expect(res.body.comments[0]).to.be.an("object");
                expect(res.body.comments[0]).to.have.keys(
                  "comment_id",
                  "votes",
                  "created_at",
                  "author",
                  "body"
                );
              });
          });
          it("GET: 200 - sort_by and order by default to created_at and desc", () => {
            return request(app)
              .get("/api/articles/1/comments")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).to.be.sortedBy("created_at", {
                  descending: true,
                });
              });
          });
          it("GET: 200 - sort_by other columns", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=body")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).to.be.sortedBy("body", {
                  descending: true,
                });
              });
          });
          it("GET: 200 - order_by descending", () => {
            return request(app)
              .get("/api/articles/1/comments?order_by=desc")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).to.be.sortedBy("created_at", {
                  descending: true,
                });
              });
          });
          it("GET: 200 - sort_by and order_by work simultaneously", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=body&order_by=desc")
              .expect(200)
              .then((res) => {
                expect(res.body.comments).to.be.sortedBy("body", {
                  descending: true,
                });
              });
          });
          it("GET: 200 - responds with an object containing empty array", () => {
            return request(app)
              .get("/api/articles/2/comments")
              .expect(200)
              .then((res) => {
                expect(res.body).to.be.an("object");
                expect(res.body.comments).to.eql([]);
              });
          });
          it("GET: 400 - sort_by is not a column name", () => {
            return request(app)
              .get("/api/articles/1/comments?sort_by=not-a-column")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request");
              });
          });
          it("GET: 400 - order_by is invalid input", () => {
            return request(app)
              .get("/api/articles/1/comments?order_by=invalid-input")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("order_by takes values asc or desc");
              });
          });
          it("GET: 400 - Invalid input for article ID", () => {
            return request(app)
              .get("/api/articles/invalid-input/comments")
              .expect(400)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("Bad request");
              });
          });
          it("GET: 404 - Article ID does not exist", () => {
            return request(app)
              .get("/api/articles/0/comments")
              .expect(404)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("No article exists with this id.");
              });
          });
        });
        describe("INVALID METHODS", () => {
          it("INVALID METHODS: 405 and method not allowed", () => {
            const invalidMethods = ["patch", "delete"];
            const methodPromises = invalidMethods.map((method) => {
              return request(app)
                [method]("/api/articles/1/comments")
                .expect(405)
                .then(({ body: { msg } }) => {
                  expect(msg).to.equal("method not allowed");
                });
            });
            return Promise.all(methodPromises);
          });
        });
      });
    });
  });
  describe("/comments", () => {
    describe("/:comment_id", () => {
      describe("PATCH", () => {
        it("PATCH: 200 - Updates vote and responeds with updated comment", () => {
          return request(app)
            .patch("/api/comments/14")
            .send({ inc_votes: 3 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.comment_id).to.equal(14);
              expect(comment.votes).to.equal(19);
              expect(comment).to.have.keys(
                "author",
                "created_at",
                "article_id",
                "body",
                "comment_id",
                "votes"
              );
            });
        });
        it("PATCH: 200 - Works with negative number of votes", () => {
          return request(app)
            .patch("/api/comments/14")
            .send({ inc_votes: -100 })
            .expect(200)
            .then(({ body: { comment } }) => {
              expect(comment.votes).to.equal(-84);
            });
        });
        it("PATCH: 200 - Cumulative", () => {
          return request(app)
            .patch("/api/comments/14")
            .send({ inc_votes: 5 })
            .expect(200)
            .then(() => {
              return request(app)
                .patch("/api/comments/14")
                .send({ inc_votes: 5 })
                .expect(200)
                .then(({ body: { comment } }) => {
                  expect(comment.votes).to.equal(26);
                });
            });
        });
        it("PATCH: 400 - No inc_votes on request body", () => {
          return request(app)
            .patch("/api/comments/14")
            .send({})
            .expect(400)
            .then(({ body: { msg } }) => expect(msg).to.equal("Bad request"));
        });
        it("PATCH: 400 - Invalid input as value of inc_votes", () => {
          return request(app)
            .patch("/api/comments/14")
            .send({ inc_votes: "Invalid-input" })
            .expect(400)
            .then(({ body: { msg } }) => expect(msg).to.equal("Bad request"));
        });
        it("PATCH: 400 - Extra properties on request body", () => {
          return request(app)
            .patch("/api/comments/14")
            .send({ inc_votes: 1, invalidExtraKey: "Invalid extra value" })
            .expect(400)
            .then(({ body: { msg } }) => expect(msg).to.equal("Bad request"));
        });
        it("PATCH: 400 - One key that isnt inc_votes", () => {
          return request(app)
            .patch("/api/comments/14")
            .send({ Invalid: "Input" })
            .expect(400)
            .then(({ body: { msg } }) => expect(msg).to.equal("Bad request"));
        });
        it("PATCH: 404 - Valid comment ID which does not exist", () => {
          return request(app)
            .patch("/api/comments/999")
            .send({ inc_votes: 2 })
            .expect(404)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Comment not found");
            });
        });
        it("PATCH: 400 - Invalid comment ID", () => {
          return request(app)
            .patch("/api/comments/not-an-comment-id")
            .send({ inc_votes: 7 })
            .expect(400)
            .then(({ body: { msg } }) => {
              expect(msg).to.equal("Bad request");
            });
        });
      });
      describe("DELETE", () => {
        it("DELETE: 204 - no content for successful deletion", () => {
          return request(app).delete("/api/comments/3").expect(204);
        });
        it("DELETE: 404 - valid comment_id that does not exist", () => {
          return request(app).delete("/api/comments/1000").expect(404);
        });
      });
      describe("INVALID METHODS", () => {
        it("INVALID METHODS: 405 and method not allowed", () => {
          const invalidMethods = ["get", "post"];
          const methodPromises = invalidMethods.map((method) => {
            return request(app)
              [method]("/api/comments/3")
              .expect(405)
              .then(({ body: { msg } }) => {
                expect(msg).to.equal("method not allowed");
              });
          });
          return Promise.all(methodPromises);
        });
      });
    });
  });
});
