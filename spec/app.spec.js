process.env.NODE_ENV = "test";

const { expect } = require("chai");
const app = require("../app");
const request = require("supertest");
const client = require("../db/index");

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
  describe("/topics", () => {
    describe("GET", () => {
      it("GET: 200 - Responds an object cotaining an array of topics", () => {
        return request(app)
          .get("/api/topics")
          .expect(200)
          .then(res => {
            expect(res.body.topics).to.be.an("array");
            expect(res.body.topics[0]).to.be.an("object");
            expect(res.body.topics[0]).to.have.all.keys("description", "slug");
          });
      });
    });
    describe("INVALID METHODS", () => {
      it("INVALID METHODS: 405 and method not allowed", () => {
        const invalidMethods = ["post", "put", "delete"];
        const methodPromises = invalidMethods.map(method => {
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
          .then(result => {
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
          .then(result => {
            expect(result.body.msg).to.equal("User not found");
          });
      });
    });
    describe("INVALID METHODS", () => {
      it("INVALID METHODS: 405 and method not allowed", () => {
        const invalidMethods = ["post", "patch", "delete"];
        const methodPromises = invalidMethods.map(method => {
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
            .get("/api/articles/5")
            .expect(200)
            .then(({ body: { article } }) => {
              expect(article.comment_count).to.equal("2");
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
      });
      describe("INVALID METHODS", () => {
        it("INVALID METHODS: 405 and method not allowed", () => {
          const invalidMethods = ["post", "delete"];
          const methodPromises = invalidMethods.map(method => {
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
    });
  });
  describe("", () => {
    it("", () => {});
  });
});
