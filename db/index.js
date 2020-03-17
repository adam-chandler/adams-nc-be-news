const dbConfig = require("../knexfile");
const knex = require("knex");
const client = knex(dbConfig);

module.exports = client;
